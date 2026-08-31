/* @ds-bundle: {"format":4,"namespace":"WukongUltimateDesignSystem_df4073","components":[{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"SealBadge","sourcePath":"components/display/SealBadge.jsx"},{"name":"Tag","sourcePath":"components/display/Tag.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/display/Badge.jsx":"4b0e1e2a4a46","components/display/Card.jsx":"d546876a16c9","components/display/SealBadge.jsx":"cb804eb6d23e","components/display/Tag.jsx":"d21985a67680","components/feedback/Dialog.jsx":"22a3797bece2","components/feedback/Toast.jsx":"d0836553ebbd","components/forms/Button.jsx":"e33529ac40ba","components/forms/Checkbox.jsx":"48d94c279a59","components/forms/Input.jsx":"e10d5054a81c","components/forms/Radio.jsx":"1065ba0d4936","components/forms/Select.jsx":"bab135b0a86c","components/forms/Switch.jsx":"ccee4e428f69","components/navigation/Tabs.jsx":"bcdd0ee3e09d","ui_kits/website/Site.jsx":"0b0b69a5dd0a"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.WukongUltimateDesignSystem_df4073 = window.WukongUltimateDesignSystem_df4073 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/display/Badge.jsx
try { (() => {
const TONES = {
  red: {
    bg: 'var(--seal-red)',
    fg: '#fff'
  },
  gold: {
    bg: 'var(--gold)',
    fg: 'var(--ink-1)'
  },
  ink: {
    bg: 'var(--ink-1)',
    fg: '#fff'
  },
  ok: {
    bg: 'var(--ok)',
    fg: '#fff'
  },
  quiet: {
    bg: 'var(--accent-quiet)',
    fg: 'var(--seal-red-deep)'
  }
};
function Badge({
  tone = 'red',
  children,
  style
}) {
  const t = TONES[tone] || TONES.red;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      background: t.bg,
      color: t.fg,
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      fontWeight: 800,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      padding: '3px 10px',
      borderRadius: 'var(--radius-pill)',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function Card({
  title,
  eyebrow,
  footer,
  children,
  way,
  padding = 20,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: way ? `var(--way-${way})` : 'var(--surface-card)',
      border: '1px solid var(--border-soft)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-card)',
      padding,
      fontFamily: 'var(--font-body)',
      color: ['navy', 'maroon', 'brown', 'green'].includes(way) ? 'var(--text-on-dark)' : 'var(--text-body)',
      ...style
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: 'var(--track-wide)',
      textTransform: 'uppercase',
      color: 'var(--seal-red)',
      marginBottom: 6
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 22,
      lineHeight: 1.2,
      marginBottom: 8
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      lineHeight: 'var(--leading-body)'
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      paddingTop: 12,
      borderTop: '1px solid var(--border-soft)',
      fontSize: 14
    }
  }, footer));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/SealBadge.jsx
try { (() => {
function SealBadge({
  glyph = '悟',
  size = 48,
  latin = false,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      background: 'var(--seal-red)',
      color: '#fff',
      borderRadius: Math.max(6, size * 0.16),
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
      boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.35)',
      fontFamily: latin ? 'var(--font-display)' : 'var(--font-cn)',
      fontWeight: latin ? 700 : 400,
      fontSize: size * (latin ? 0.36 : 0.5),
      lineHeight: 1,
      ...style
    }
  }, glyph);
}
Object.assign(__ds_scope, { SealBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/SealBadge.jsx", error: String((e && e.message) || e) }); }

// components/display/Tag.jsx
try { (() => {
function Tag({
  way,
  children,
  onRemove,
  style
}) {
  const dark = ['navy', 'maroon', 'brown', 'green'].includes(way);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: way ? `var(--way-${way})` : 'var(--paper)',
      color: dark ? 'var(--text-on-dark)' : 'var(--ink-1)',
      border: '1px solid var(--border-soft)',
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      fontWeight: 600,
      padding: '4px 12px',
      borderRadius: 'var(--radius-pill)',
      ...style
    }
  }, children, onRemove && /*#__PURE__*/React.createElement("span", {
    onClick: onRemove,
    style: {
      cursor: 'pointer',
      opacity: .6,
      fontWeight: 400
    }
  }, "\u2715"));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function Dialog({
  open = false,
  title,
  children,
  onClose,
  actions
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(46,49,56,.45)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-float)',
      width: 'min(440px, calc(100vw - 48px))',
      padding: 24,
      fontFamily: 'var(--font-body)',
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 24,
      lineHeight: 1.15
    }
  }, title), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: 18,
      color: 'var(--text-faint)',
      padding: 2
    }
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      lineHeight: 'var(--leading-body)',
      color: 'var(--text-muted)'
    }
  }, children), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      justifyContent: 'flex-end',
      marginTop: 20
    }
  }, actions)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function Toast({
  open = true,
  tone = 'ink',
  children,
  style
}) {
  if (!open) return null;
  const bg = {
    ink: 'var(--ink-1)',
    ok: 'var(--ok)',
    danger: 'var(--danger)'
  }[tone] || 'var(--ink-1)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      background: bg,
      color: '#fff',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      fontWeight: 600,
      padding: '10px 16px',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-float)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--gold)',
      flexShrink: 0
    }
  }), children);
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
const S = {
  primary: {
    background: 'var(--seal-red)',
    color: '#fff',
    border: '1px solid transparent'
  },
  secondary: {
    background: 'transparent',
    color: 'var(--ink-1)',
    border: '1px solid var(--border-ink)'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--seal-red-deep)',
    border: '1px solid transparent'
  },
  gold: {
    background: 'var(--gold)',
    color: 'var(--ink-1)',
    border: '1px solid transparent'
  }
};
const SZ = {
  sm: {
    padding: '6px 14px',
    fontSize: 14
  },
  md: {
    padding: '9px 20px',
    fontSize: 16
  },
  lg: {
    padding: '12px 28px',
    fontSize: 18
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  onClick,
  style
}) {
  const [hov, setHov] = React.useState(false),
    [act, setAct] = React.useState(false);
  const base = S[variant] || S.primary;
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    disabled: disabled,
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => {
      setHov(false);
      setAct(false);
    },
    onMouseDown: () => setAct(true),
    onMouseUp: () => setAct(false),
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      borderRadius: 'var(--radius-md)',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      transition: 'all var(--dur-fast) var(--ease-brush)',
      transform: act ? 'translateY(1px)' : 'none',
      letterSpacing: '0.01em',
      ...base,
      ...SZ[size],
      ...(hov && !disabled ? variant === 'primary' ? {
        background: 'var(--accent-hover)'
      } : variant === 'gold' ? {
        background: 'var(--gold-deep)',
        color: '#fff'
      } : {
        background: 'var(--accent-quiet)'
      } : {}),
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  checked = false,
  onChange,
  disabled = false,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: 'var(--text-body)',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      ...style
    },
    onClick: () => !disabled && onChange && onChange(!checked)
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      borderRadius: 'var(--radius-sm)',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: checked ? 'var(--seal-red)' : 'var(--surface-card)',
      border: `1.5px solid ${checked ? 'var(--seal-red)' : 'var(--ink-3)'}`,
      transition: 'all var(--dur-fast) var(--ease-brush)'
    }
  }, checked && /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 6.5 5 9.5 10 3",
    stroke: "#fff",
    strokeWidth: "2",
    fill: "none",
    strokeLinecap: "round"
  }))), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function Input({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  hint,
  error,
  style
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-body)',
      color: 'var(--text-body)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 700
    }
  }, label), /*#__PURE__*/React.createElement("input", {
    type: type,
    placeholder: placeholder,
    value: value,
    onChange: e => onChange && onChange(e.target.value),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 16,
      padding: '10px 12px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface-card)',
      color: 'var(--text-body)',
      outline: 'none',
      border: `1px solid ${error ? 'var(--danger)' : focus ? 'var(--seal-red)' : 'var(--border-soft)'}`,
      boxShadow: focus ? '0 0 0 3px var(--accent-quiet)' : 'none',
      transition: 'all var(--dur-fast) var(--ease-brush)'
    }
  }), (error || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: error ? 'var(--danger)' : 'var(--text-faint)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function Radio({
  name,
  options = [],
  value,
  onChange,
  direction = 'column',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "radiogroup",
    style: {
      display: 'flex',
      flexDirection: direction,
      gap: direction === 'row' ? 18 : 10,
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, options.map(o => {
    const v = typeof o === 'string' ? {
      value: o,
      label: o
    } : o;
    const on = v.value === value;
    return /*#__PURE__*/React.createElement("label", {
      key: v.value,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        fontSize: 15,
        color: 'var(--text-body)',
        cursor: 'pointer'
      },
      onClick: () => onChange && onChange(v.value)
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 20,
        height: 20,
        borderRadius: '50%',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1.5px solid ${on ? 'var(--seal-red)' : 'var(--ink-3)'}`,
        background: 'var(--surface-card)',
        transition: 'all var(--dur-fast) var(--ease-brush)'
      }
    }, on && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: 'var(--seal-red)'
      }
    })), v.label);
  }));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function Select({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select…',
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-body)',
      color: 'var(--text-body)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 700
    }
  }, label), /*#__PURE__*/React.createElement("select", {
    value: value ?? '',
    onChange: e => onChange && onChange(e.target.value),
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 16,
      padding: '10px 12px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface-card)',
      color: value ? 'var(--text-body)' : 'var(--text-faint)',
      border: '1px solid var(--border-soft)',
      outline: 'none',
      appearance: 'auto'
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder), options.map(o => {
    const v = typeof o === 'string' ? {
      value: o,
      label: o
    } : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v.value,
      value: v.value
    }, v.label);
  })));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  label,
  checked = false,
  onChange,
  disabled = false,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: 'var(--text-body)',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      ...style
    },
    onClick: () => !disabled && onChange && onChange(!checked)
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 22,
      borderRadius: 'var(--radius-pill)',
      padding: 2,
      boxSizing: 'border-box',
      background: checked ? 'var(--seal-red)' : 'var(--ink-wash)',
      transition: 'background var(--dur-med) var(--ease-brush)',
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      borderRadius: '50%',
      background: '#fff',
      display: 'block',
      transform: checked ? 'translateX(18px)' : 'none',
      transition: 'transform var(--dur-med) var(--ease-brush)',
      boxShadow: '0 1px 2px rgba(0,0,0,.2)'
    }
  })), label);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function Tabs({
  tabs = [],
  active,
  onChange,
  style
}) {
  const [hov, setHov] = React.useState(null);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      borderBottom: '1px solid var(--border-soft)',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, tabs.map(t => {
    const on = t === active;
    return /*#__PURE__*/React.createElement("button", {
      key: t,
      onClick: () => onChange && onChange(t),
      onMouseEnter: () => setHov(t),
      onMouseLeave: () => setHov(null),
      style: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '10px 16px',
        fontSize: 15,
        fontFamily: 'var(--font-body)',
        fontWeight: on ? 800 : 500,
        color: on ? 'var(--seal-red-deep)' : hov === t ? 'var(--ink-1)' : 'var(--text-muted)',
        borderBottom: on ? '2.5px solid var(--seal-red)' : '2.5px solid transparent',
        marginBottom: -1,
        transition: 'color var(--dur-fast) var(--ease-brush)'
      }
    }, t);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Site.jsx
try { (() => {
const DS = window.WukongUltimateDesignSystem_df4073 || {};
const {
  Button,
  Input,
  Select,
  Checkbox,
  Radio,
  Card,
  Badge,
  Tag,
  SealBadge,
  Tabs,
  Dialog,
  Toast
} = DS;
const SQUADS = [{
  cn: '大聖',
  name: 'Dasheng',
  en: 'Great Sage',
  way: 'cream',
  dark: false
}, {
  cn: '元帥',
  name: 'Marshal',
  en: 'Zhu Bajie',
  way: 'navy',
  dark: true
}, {
  cn: '聖僧',
  name: 'Holy Monk',
  en: 'Tang Seng',
  way: 'blush',
  dark: false
}, {
  cn: '霓裳',
  name: 'Nichang',
  en: 'Moon Fairy',
  way: 'celadon',
  dark: false
}, {
  cn: '敖烈',
  name: 'Dragon',
  en: 'Ao Lie',
  way: 'sky',
  dark: false
}, {
  cn: '魅妖',
  name: 'Enchantress',
  en: 'Baigujing',
  way: 'maroon',
  dark: true
}, {
  cn: '如來',
  name: 'Buddha',
  en: 'Rulai',
  way: 'brown',
  dark: true
}, {
  cn: '羅漢',
  name: 'Luohan',
  en: 'Sha Wujing',
  way: 'green',
  dark: true
}];
const GAMES = [{
  t: '9:00',
  a: 'Dasheng',
  b: 'Marshal',
  f: 'Field 1',
  tag: 'Pool A'
}, {
  t: '9:00',
  a: 'Nichang',
  b: 'Dragon',
  f: 'Field 2',
  tag: 'Pool B'
}, {
  t: '10:20',
  a: 'Holy Monk',
  b: 'Enchantress',
  f: 'Field 1',
  tag: 'Pool A'
}, {
  t: '10:20',
  a: 'Buddha',
  b: 'Dasheng',
  f: 'Field 2',
  tag: 'Pool B'
}, {
  t: '11:40',
  a: 'Marshal',
  b: 'Dragon',
  f: 'Field 1',
  tag: 'Crossover'
}, {
  t: '14:00',
  a: 'TBD',
  b: 'TBD',
  f: 'Field 1',
  tag: 'Finals'
}];
function Nav({
  onRegister
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      padding: '16px 40px',
      background: 'var(--surface-page)',
      borderBottom: '1px solid var(--border-soft)',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(SealBadge, {
    glyph: "\u609F",
    size: 40
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 18,
      lineHeight: 1.1
    }
  }, "Toronto Wukong"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-muted)',
      letterSpacing: '0.08em',
      textTransform: 'uppercase'
    }
  }, "Ultimate Club"))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), ['Tournament', 'Squads', 'Schedule'].map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: '#' + l.toLowerCase(),
    style: {
      textDecoration: 'none',
      fontWeight: 600,
      fontSize: 15
    }
  }, l)), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: onRegister
  }, "Register"));
}
function Hero({
  onRegister
}) {
  return /*#__PURE__*/React.createElement("div", {
    id: "tournament",
    style: {
      background: 'var(--way-cream)',
      display: 'grid',
      gridTemplateColumns: '1.1fr 1fr',
      alignItems: 'center',
      gap: 24,
      padding: '40px 40px 0',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 56
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(Badge, null, "Aug 22\u201323"), /*#__PURE__*/React.createElement(Badge, {
    tone: "gold"
  }, "Sunnybrook Park")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 58,
      lineHeight: 1.05,
      letterSpacing: '0.01em'
    }
  }, "The Journey West", /*#__PURE__*/React.createElement("br", null), "Invitational"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 18,
      lineHeight: 'var(--leading-body)',
      color: 'var(--text-muted)',
      maxWidth: '46ch',
      margin: '16px 0 24px'
    }
  }, "Eight squads. Eight colorways. Two days of ultimate under the Great Sage's watch. Bring your legs \u2014 we bring the dragon."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: onRegister
  }, "Register your squad"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    onClick: () => {
      document.getElementById('schedule').scrollTop;
      location.hash = 'schedule';
    }
  }, "See schedule"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/art/wukong-cutout.png",
    alt: "\u5927\u8056 Great Sage ink painting",
    style: {
      height: 440,
      display: 'block'
    }
  })));
}
function Squads() {
  return /*#__PURE__*/React.createElement("div", {
    id: "squads",
    style: {
      padding: '56px 40px',
      maxWidth: 'var(--container)',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 14,
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-cn)',
      fontSize: 34,
      color: 'var(--seal-red-deep)'
    }
  }, "\u516B\u968A"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 34,
      margin: 0
    }
  }, "The Eight Squads")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 14
    }
  }, SQUADS.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.name,
    style: {
      background: `var(--way-${s.way})`,
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-soft)',
      padding: 18,
      color: s.dark ? 'var(--text-on-dark)' : 'var(--ink-1)',
      minHeight: 120,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-cn)',
      fontSize: 34,
      lineHeight: 1
    }
  }, s.cn), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 17,
      marginTop: 6
    }
  }, s.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      opacity: .75
    }
  }, s.en)))));
}
function Schedule() {
  const [tab, setTab] = React.useState('Saturday');
  const rows = tab === 'Saturday' ? GAMES.slice(0, 4) : GAMES.slice(4);
  return /*#__PURE__*/React.createElement("div", {
    id: "schedule",
    style: {
      background: 'var(--surface-card)',
      borderTop: '1px solid var(--border-soft)',
      borderBottom: '1px solid var(--border-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '56px 40px',
      maxWidth: 'var(--container)',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 34,
      margin: '0 0 16px'
    }
  }, "Schedule"), /*#__PURE__*/React.createElement(Tabs, {
    tabs: ['Saturday', 'Sunday'],
    active: tab,
    onChange: setTab
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      marginTop: 18
    }
  }, rows.map((g, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      background: 'var(--paper)',
      border: '1px solid var(--border-soft)',
      borderRadius: 'var(--radius-md)',
      padding: '12px 18px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      width: 56
    }
  }, g.t), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontSize: 16
    }
  }, /*#__PURE__*/React.createElement("b", null, g.a), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)'
    }
  }, "vs"), " ", /*#__PURE__*/React.createElement("b", null, g.b)), /*#__PURE__*/React.createElement(Tag, null, g.f), /*#__PURE__*/React.createElement(Badge, {
    tone: g.tag === 'Finals' ? 'gold' : 'quiet'
  }, g.tag))))));
}
function Register({
  toast
}) {
  const [name, setName] = React.useState('');
  const [squad, setSquad] = React.useState('');
  const [div, setDiv] = React.useState('Mixed');
  const [disc, setDisc] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    id: "register",
    style: {
      background: 'var(--way-navy)',
      color: 'var(--text-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '56px 40px',
      maxWidth: 'var(--container)',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1.1fr',
      gap: 48,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-cn)',
      fontSize: 40,
      color: 'var(--gold)'
    }
  }, "\u5831\u540D"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 38,
      margin: '4px 0 12px'
    }
  }, "Join the Journey"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      lineHeight: 'var(--leading-body)',
      opacity: .8,
      maxWidth: '44ch'
    }
  }, "Player fee is $45 and covers both days, fields, discs, and your character jersey in light and dark. Rosters lock Aug 15."), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/photos/jersey-mockup-dragon.jpg",
    alt: "Dragon colorway jersey, front and back",
    style: {
      width: '100%',
      borderRadius: 'var(--radius-lg)',
      marginTop: 18
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      color: 'var(--text-body)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-float)',
      padding: 28,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 24
    }
  }, "Player registration"), /*#__PURE__*/React.createElement(Input, {
    label: "Player name",
    placeholder: "Sun Wukong",
    value: name,
    onChange: setName
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Squad",
    placeholder: "Pick your character",
    options: SQUADS.map(s => s.name),
    value: squad,
    onChange: setSquad
  }), /*#__PURE__*/React.createElement(Radio, {
    options: ['Open', 'Mixed'],
    value: div,
    onChange: setDiv,
    direction: "row"
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "I'll bring my own disc",
    checked: disc,
    onChange: setDisc
  }), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => {
      if (name && squad) {
        setOpen(true);
      } else {
        toast('Name and squad are required');
      }
    }
  }, "Lock in my spot \u2014 $45"))), /*#__PURE__*/React.createElement(Dialog, {
    open: open,
    title: "Spot confirmed",
    onClose: () => setOpen(false),
    actions: /*#__PURE__*/React.createElement(Button, {
      onClick: () => setOpen(false)
    }, "Done")
  }, name || 'Player', " joins ", /*#__PURE__*/React.createElement("b", null, squad || 'a squad'), " (", div, "). Check your email for payment and the waiver \u2014 see you at Sunnybrook."));
}
function Footer() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-page)',
      padding: '28px 40px',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      borderTop: '1px solid var(--border-soft)'
    }
  }, /*#__PURE__*/React.createElement(SealBadge, {
    glyph: "TW",
    latin: true,
    size: 32
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--text-muted)'
    }
  }, "Toronto Wukong Ultimate Club \xB7 spirit of the game since the Tang dynasty"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("a", {
    href: "#tournament",
    style: {
      fontSize: 14
    }
  }, "Top"));
}
function Site() {
  const [toast, setToast] = React.useState(null);
  const say = m => {
    setToast(m);
    setTimeout(() => setToast(null), 2600);
  };
  const reg = () => {
    location.hash = 'register';
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      background: 'var(--surface-page)',
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement(Nav, {
    onRegister: reg
  }), /*#__PURE__*/React.createElement(Hero, {
    onRegister: reg
  }), /*#__PURE__*/React.createElement(Squads, null), /*#__PURE__*/React.createElement(Schedule, null), /*#__PURE__*/React.createElement(Register, {
    toast: say
  }), /*#__PURE__*/React.createElement(Footer, null), toast && /*#__PURE__*/React.createElement(Toast, {
    tone: "danger",
    style: {
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 100
    }
  }, toast));
}
window.WukongSite = Site;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Site.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.SealBadge = __ds_scope.SealBadge;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
