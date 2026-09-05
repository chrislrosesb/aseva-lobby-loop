// Shared helpers & tokens for the Aseva lobby loop.

const A = {
  navy: '#051a35',
  navyDeep: '#020d1e',
  navyMid: '#0a2446',
  cyan: '#00a1e2',
  cyanSoft: '#46c2ee',
  blue: '#0071ce',
  blueDark: '#0049a6',
  ink: '#051a35',
  paper: '#F0F3F4',
  paperWarm: '#f7f5f0',
  line: '#1a334e',
  muted: '#6b7a8c',
  white: '#ffffff',
};

const FONT_H = '"Source Sans 3", "Source Sans Pro", "Helvetica Neue", Helvetica, Arial, sans-serif';
const FONT_B = '"Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif';
const FONT_M = '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace';

// A thin horizontal rule with an animated fill wiping left-to-right.
function WipeBar({ x, y, width, height = 2, color = A.cyan, start = 0, end = 0.8, ease = Easing.easeOutQuart }) {
  const { progress } = useSprite();
  const t = clamp((progress - start) / (end - start), 0, 1);
  const w = ease(t) * width;
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: w, height,
      background: color, willChange: 'width',
    }}/>
  );
}

// Big numeric/letter counter that can tick between values.
function Counter({ from, to, start = 0, end = 1, ease = Easing.easeOutCubic, format = (v) => Math.round(v) }) {
  const { progress } = useSprite();
  const t = clamp((progress - start) / (end - start), 0, 1);
  const v = from + (to - from) * ease(t);
  return format(v);
}

// Vertical character-by-character reveal with subtle upward slide.
function SplitWord({ text, x, y, size, color = A.white, font = FONT_H, weight = 600, delay = 0, stagger = 0.035, letterSpacing = '-0.02em', exitAt = null }) {
  const { localTime, duration } = useSprite();
  const chars = Array.from(text);
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      display: 'flex', overflow: 'hidden',
      fontFamily: font, fontWeight: weight, fontSize: size, color,
      letterSpacing, lineHeight: 1, willChange: 'transform',
    }}>
      {chars.map((c, i) => {
        const startT = delay + i * stagger;
        const endT = startT + 0.5;
        let p = clamp((localTime - startT) / (endT - startT), 0, 1);
        p = Easing.easeOutQuart(p);
        let op = p;
        let ty = (1 - p) * size * 0.9;
        if (exitAt != null && localTime > exitAt) {
          const et = clamp((localTime - exitAt) / 0.45, 0, 1);
          op *= (1 - Easing.easeInCubic(et));
          ty += -Easing.easeInCubic(et) * size * 0.4;
        }
        return (
          <span key={i} style={{
            display: 'inline-block',
            transform: `translateY(${ty}px)`,
            opacity: op,
            whiteSpace: 'pre',
          }}>{c}</span>
        );
      })}
    </div>
  );
}

// Drifting background: navy with subtle moving grid + vignette.
function GridBg({ color = 'rgba(0,161,226,0.08)', spacing = 80, speed = 4 }) {
  const time = useTime();
  const offset = (time * speed) % spacing;
  return (
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: `
        linear-gradient(${color} 1px, transparent 1px),
        linear-gradient(90deg, ${color} 1px, transparent 1px)
      `,
      backgroundSize: `${spacing}px ${spacing}px`,
      backgroundPosition: `${offset}px ${offset}px`,
      maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 80%)',
      WebkitMaskImage: 'radial-gradient(ellipse at center, black 35%, transparent 80%)',
    }}/>
  );
}

// Scanline glow sweeping vertically.
function ScanGlow({ color = 'rgba(0,161,226,0.18)', period = 8 }) {
  const time = useTime();
  const y = ((time % period) / period) * 1200 - 200;
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, top: y, height: 260,
      background: `linear-gradient(180deg, transparent, ${color}, transparent)`,
      pointerEvents: 'none',
      filter: 'blur(8px)',
    }}/>
  );
}

// A chapter ticker in the corner.
function ChapterTicker({ current, total = 8, label }) {
  return (
    <div style={{
      position: 'absolute', left: 64, bottom: 56,
      fontFamily: FONT_M, color: 'rgba(255,255,255,0.55)',
      fontSize: 16, letterSpacing: '0.18em', textTransform: 'uppercase',
      display: 'flex', alignItems: 'center', gap: 20,
    }}>
      <span style={{ color: A.cyan }}>{String(current).padStart(2, '0')}</span>
      <span>/</span>
      <span>{String(total).padStart(2, '0')}</span>
      <span style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.25)' }}/>
      <span style={{ color: 'rgba(255,255,255,0.85)' }}>{label}</span>
    </div>
  );
}

// Persistent corner wordmark that appears after intro.
// Uses the brandmark PNG tinted cyan via filter trick.
function CornerMark({ variant = 'dark' }) {
  const time = useTime();
  const op = clamp((time - 14) / 1.5, 0, 1) * 0.95;
  const src = 'assets/logo-horizontal-1c.png';
  // For dark bg: invert blue logo to white. For light bg: use as-is.
  const filter = variant === 'dark'
    ? 'brightness(0) invert(1)'
    : 'none';
  return (
    <div style={{
      position: 'absolute', right: 64, top: 48,
      opacity: op, display: 'flex', alignItems: 'center', gap: 16,
    }}>
      <span style={{
        width: 10, height: 10, borderRadius: '50%',
        background: A.cyan,
        boxShadow: `0 0 18px ${A.cyan}`,
        animation: 'asevaPulse 2s ease-in-out infinite',
      }}/>
      <img src={src} alt="Aseva" style={{
        height: 34, width: 'auto', display: 'block',
        filter,
        opacity: variant === 'dark' ? 0.9 : 1,
      }}/>
    </div>
  );
}

// Live-ish clock / date in corner for ambience.
function LiveBadge() {
  const time = useTime();
  const op = clamp((time - 14) / 1.5, 0, 1) * 0.7;
  const dots = Math.floor(time * 2) % 4;
  return (
    <div style={{
      position: 'absolute', right: 64, bottom: 56,
      fontFamily: FONT_M, color: 'rgba(255,255,255,0.5)',
      fontSize: 15, letterSpacing: '0.2em', textTransform: 'uppercase',
      opacity: op, display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <span style={{ width: 7, height: 7, background: '#3fd977', borderRadius: '50%',
        boxShadow: '0 0 10px #3fd977' }}/>
      NETWORK LIVE{'.'.repeat(dots).padEnd(3, ' ')}
    </div>
  );
}

Object.assign(window, { A, FONT_H, FONT_B, FONT_M, WipeBar, Counter, SplitWord, GridBg, ScanGlow, ChapterTicker, CornerMark, LiveBadge });
