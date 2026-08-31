import type { Connect, Plugin } from 'vite';
import { applyPatch, canApply, emptyState, parsePatch } from '../shared/state';
import type { Role, TournamentState } from '../shared/types';

/**
 * In-memory stand-in for the Netlify function, for local dev and the smoke
 * suite. It reuses the real `shared/state` logic, so permission rules and patch
 * validation are the same code that runs in production.
 *
 * This is a Vite server plugin, so it exists only in `vite dev` / `vite preview`
 * — it is never part of the built site.
 */
export function mockApi(): Plugin {
  let state: TournamentState = emptyState();

  const adminPin = process.env.ADMIN_PIN || '8888';
  const captainPin = process.env.CAPTAIN_PIN || '2222';

  const roleFor = (pin: unknown): Role =>
    typeof pin === 'string' && pin
      ? pin === adminPin
        ? 'admin'
        : pin === captainPin
          ? 'captain'
          : 'player'
      : 'player';

  const readJson = (req: Connect.IncomingMessage): Promise<Record<string, unknown>> =>
    new Promise((resolve) => {
      let raw = '';
      req.on('data', (c) => (raw += c));
      req.on('end', () => {
        try {
          resolve(JSON.parse(raw || '{}'));
        } catch {
          resolve({});
        }
      });
    });

  const middleware: Connect.NextHandleFunction = (req, res, next) => {
    const url = (req.url || '').split('?')[0];
    if (url !== '/api/state' && url !== '/api/auth') return next();

    const send = (status: number, body: unknown) => {
      res.statusCode = status;
      res.setHeader('content-type', 'application/json');
      res.setHeader('cache-control', 'no-store');
      res.end(JSON.stringify(body));
    };

    if (url === '/api/state' && req.method === 'GET') {
      send(200, { state });
      return;
    }

    if (req.method !== 'POST') {
      send(405, { error: 'method_not_allowed' });
      return;
    }

    void readJson(req).then((body) => {
      const role = roleFor(body.pin);

      if (url === '/api/auth') {
        send(200, { role });
        return;
      }

      const patch = parsePatch(body.patch);
      if (!patch) {
        send(400, { error: 'bad_patch' });
        return;
      }
      if (!canApply(role, patch.kind)) {
        send(403, { error: 'forbidden', role });
        return;
      }

      state = { ...applyPatch(state, patch, role), rev: Date.now() };
      send(200, { state, role });
    });
  };

  return {
    name: 'jwc-mock-api',
    configureServer: (server) => {
      server.middlewares.use(middleware);
    },
    configurePreviewServer: (server) => {
      server.middlewares.use(middleware);
    },
  };
}
