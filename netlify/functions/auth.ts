import type { Role } from '../../shared/types';

/**
 * Exchanges a PIN for a role, so the UI can show ADMIN/CAPTAIN without making a
 * write first. The PINs live in Netlify environment variables and are never
 * shipped to the browser; every write is re-checked server-side regardless of
 * what this returned.
 */
export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'method_not_allowed' }, { status: 405 });
  }

  let pin: unknown;
  try {
    pin = (await req.json())?.pin;
  } catch {
    return Response.json({ error: 'bad_json' }, { status: 400 });
  }

  let role: Role = 'player';
  if (typeof pin === 'string' && pin) {
    if (process.env.ADMIN_PIN && pin === process.env.ADMIN_PIN) role = 'admin';
    else if (process.env.CAPTAIN_PIN && pin === process.env.CAPTAIN_PIN) role = 'captain';
  }

  return Response.json({ role }, { headers: { 'cache-control': 'no-store' } });
};

export const config = { path: '/api/auth' };
