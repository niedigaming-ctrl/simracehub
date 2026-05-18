// Shared SimRacing UI primitives
// All icons are simple geometric — never overly stylized SVG drawings

const fmtPrice = (p) => p.toLocaleString("de-DE") + " €";

// Category icons — minimal geometric, NOT illustrations
function CatIcon({ name, size = 18, color = "currentColor" }) {
  const s = size, c = color, sw = 1.6;
  const wrap = (children) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  );
  switch (name) {
    case "wheelbase": return wrap(<><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /><path d="M12 6v-3M12 21v-3M6 12H3M21 12h-3" /></>);
    case "wheel":     return wrap(<><circle cx="12" cy="12" r="8" /><path d="M4 12h16M12 4v3M12 17v3M7 7l2 2M17 17l-2-2" /></>);
    case "pedals":    return wrap(<><rect x="4" y="6" width="4" height="12" rx="1" /><rect x="10" y="4" width="4" height="14" rx="1" /><rect x="16" y="6" width="4" height="12" rx="1" /></>);
    case "shifter":   return wrap(<><circle cx="12" cy="6" r="2" /><path d="M12 8v10M8 18h8" /></>);
    case "cockpit":   return wrap(<><path d="M4 18l4-12h8l4 12M7 14h10M9 18v3M15 18v3" /></>);
    case "monitor":   return wrap(<><rect x="3" y="6" width="6" height="10" rx="0.5" /><rect x="9" y="4" width="6" height="14" rx="0.5" /><rect x="15" y="6" width="6" height="10" rx="0.5" /></>);
    case "seat":      return wrap(<><path d="M7 4h6a3 3 0 0 1 3 3v9H7zM7 16v4M16 16v4" /></>);
    case "accessory": return wrap(<><circle cx="8" cy="8" r="3" /><path d="M11 11l8 8M14 19l5-5" /></>);
    case "bundle":    return wrap(<><rect x="3" y="8" width="18" height="12" rx="1" /><path d="M3 12h18M9 8v-3h6v3" /></>);
    default:          return wrap(<rect x="4" y="4" width="16" height="16" rx="2" />);
  }
}

// Striped placeholder for product imagery — clearly a placeholder
function ProductImage({ category, label, height = 200, accent = "var(--accent)", src = null }) {
  const sid = "stripes-" + category + "-" + Math.random().toString(36).slice(2, 7);
  if (src) {
    return (
      <div style={{
        position: "relative", width: "100%", height: height + "px",
        background: "linear-gradient(180deg, #f4f4f0 0%, #e8e8e2 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        overflow: "hidden",
      }}>
        <img src={src} alt={label} loading="lazy" style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "contain", padding: 12, display: "block",
        }} />
        <div style={{
          position: "absolute", left: 12, top: 12,
          fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.16em",
          color: "rgba(0,0,0,0.45)", background: "rgba(255,255,255,0.7)",
          padding: "2px 6px",
        }}>// LIVE</div>
      </div>
    );
  }
  return (
    <div style={{
      position: "relative", width: "100%", height: height + "px",
      background: "linear-gradient(180deg, #161616 0%, #0d0d0d 100%)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      overflow: "hidden",
    }}>
      <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 200 200" style={{ position: "absolute", inset: 0, opacity: 0.18 }}>
        <defs>
          <pattern id={sid} patternUnits="userSpaceOnUse" width="14" height="14" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="14" stroke="#fff" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="200" height="200" fill={`url(#${sid})`} />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 8,
      }}>
        <CatIcon name={category} size={36} color="rgba(255,255,255,0.32)" />
        <div style={{
          fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.12em",
          color: "rgba(255,255,255,0.4)", textTransform: "uppercase",
        }}>{label}</div>
      </div>
      <div style={{
        position: "absolute", left: 12, top: 12,
        fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.16em",
        color: "rgba(255,255,255,0.3)",
      }}>// PRODUKTBILD</div>
    </div>
  );
}

function Stars({ value, size = 12, showValue = true }) {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.4;
  const arr = [0,1,2,3,4];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{ display: "inline-flex", gap: 1 }}>
        {arr.map(i => {
          const filled = i < full ? 1 : (i === full && hasHalf ? 0.5 : 0);
          return (
            <svg key={i} width={size} height={size} viewBox="0 0 24 24" style={{ display: "block" }}>
              <defs>
                <linearGradient id={`g${i}-${value}-${size}`}>
                  <stop offset={`${filled * 100}%`} stopColor="var(--accent)" />
                  <stop offset={`${filled * 100}%`} stopColor="rgba(255,255,255,0.15)" />
                </linearGradient>
              </defs>
              <path d="M12 2l3 6.5 7 1-5 4.8 1.2 7L12 18l-6.2 3.3L7 14.3 2 9.5l7-1z" fill={`url(#g${i}-${value}-${size})`} />
            </svg>
          );
        })}
      </span>
      {showValue && <span style={{ fontFamily: "var(--mono)", fontSize: size - 1, color: "var(--text-2)" }}>{value.toFixed(1)}</span>}
    </span>
  );
}

function PlatformChip({ p }) {
  return (
    <span style={{
      fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.08em",
      padding: "2px 6px", border: "1px solid rgba(255,255,255,0.14)",
      color: "var(--text-2)", textTransform: "uppercase",
    }}>{p}</span>
  );
}

function Tag({ children, variant = "default" }) {
  const styles = {
    default: { bg: "rgba(255,255,255,0.06)", color: "var(--text)", border: "rgba(255,255,255,0.1)" },
    accent:  { bg: "var(--accent)", color: "#0a0a0a", border: "var(--accent)" },
    ghost:   { bg: "transparent", color: "var(--accent)", border: "var(--accent)" },
  };
  const s = styles[variant] || styles.default;
  return (
    <span style={{
      fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.14em",
      textTransform: "uppercase", padding: "3px 7px",
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`, fontWeight: 600,
    }}>{children}</span>
  );
}

// Slim red triangle / chevron — racing motif
function Chevron({ dir = "right", size = 10 }) {
  const r = { right: 0, down: 90, left: 180, up: 270 }[dir];
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" style={{ transform: `rotate(${r}deg)` }}>
      <path d="M3 1 L7 5 L3 9" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

Object.assign(window, { fmtPrice, CatIcon, ProductImage, Stars, PlatformChip, Tag, Chevron });
