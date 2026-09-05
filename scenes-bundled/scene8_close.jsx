// Scene 8 — Close. 165 → 180s (15s).
// Wordmark returns, pulses, with tagline and URL. Fades to black for loop.

function Scene8_Close() {
  const { localTime } = useSprite();
  const t = localTime;

  // 0-2: intro with light trail
  // 2-11: hero wordmark + tagline hold (with subtle breathing)
  // 11-15: fade to near-black for loop

  const lineT = Easing.easeOutQuart(clamp(t / 1.8, 0, 1));
  const wordT = Easing.easeOutCubic(clamp((t - 1.2) / 1.2, 0, 1));
  const tagT = Easing.easeOutCubic(clamp((t - 2.2) / 1.2, 0, 1));
  const barT = Easing.easeOutQuart(clamp((t - 3.0) / 1.5, 0, 1));

  const breathe = 1 + Math.sin(t * 1.2) * 0.012;

  const fadeOut = clamp((t - 11.5) / 3, 0, 1);
  const rootOp = 1 - fadeOut * 0.9;

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#000', overflow: 'hidden', opacity: rootOp }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, #0a1a2e 0%, #000 75%)',
      }}/>

      {/* traveling streak */}
      <div style={{
        position: 'absolute', left: lineT * 2400 - 400, top: 540,
        width: 400, height: 3, marginTop: -1.5,
        background: `linear-gradient(90deg, transparent, ${A.cyan}, transparent)`,
        filter: `drop-shadow(0 0 20px ${A.cyan}) drop-shadow(0 0 40px ${A.cyan})`,
        opacity: lineT < 0.95 ? 1 : 0,
      }}/>

      {/* horizon rule */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 540, height: 1, marginTop: -0.5,
        background: `linear-gradient(90deg, transparent, ${A.cyan}33, ${A.cyan}aa, ${A.cyan}33, transparent)`,
        opacity: clamp(t / 1.5, 0, 1) * 0.7,
      }}/>

      {/* wordmark — horizontal logo tinted white */}
      <div style={{
        position: 'absolute', left: '50%', top: '42%',
        transform: `translate(-50%, -50%) scale(${(0.94 + wordT * 0.06) * breathe})`,
        opacity: wordT,
        filter: `drop-shadow(0 0 40px rgba(0,161,226,0.4))`,
      }}>
        <img src={window.__resources.logoHorizontal} alt="Aseva" style={{
          width: 1040, height: 'auto', display: 'block',
          filter: 'brightness(0) invert(1)',
        }}/>
      </div>

      {/* accent bar */}
      <div style={{
        position: 'absolute', left: '50%', top: '54%',
        width: barT * 380, height: 3, marginLeft: -190,
        background: A.cyan,
        boxShadow: `0 0 20px ${A.cyan}`,
      }}/>

      {/* tagline */}
      <div style={{
        position: 'absolute', left: '50%', top: '58%',
        transform: `translate(-50%, ${(1 - tagT) * 20}px)`,
        opacity: tagT,
        fontFamily: FONT_M, fontSize: 28, letterSpacing: '0.45em',
        color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}>
        cybersecurity · voice · networking
      </div>

      {/* URL */}
      <div style={{
        position: 'absolute', left: '50%', top: '70%',
        transform: `translate(-50%, ${(1 - tagT) * 20}px)`,
        opacity: clamp((t - 3.5) / 1.2, 0, 1),
        fontFamily: FONT_H, fontWeight: 600, fontSize: 46,
        color: A.cyan, letterSpacing: '0.08em',
      }}>
        aseva.com
      </div>

      {/* bottom-line footer */}
      <div style={{
        position: 'absolute', left: 140, right: 140, bottom: 100,
        display: 'flex', justifyContent: 'space-between',
        opacity: clamp((t - 4) / 1.2, 0, 1),
      }}>
        <div style={{
          fontFamily: FONT_M, fontSize: 14, letterSpacing: '0.35em',
          color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase',
        }}>
          SANTA BARBARA · EST. 1995
        </div>
        <div style={{
          fontFamily: FONT_M, fontSize: 14, letterSpacing: '0.35em',
          color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase',
        }}>
          (800) 456-5800
        </div>
      </div>

      {/* subtle pulsing ring around wordmark */}
      <PulseRing t={t}/>
    </div>
  );
}

function PulseRing({ t }) {
  // Two rings expanding outward from center at staggered phases.
  const rings = [0, 2.2];
  return (
    <>
      {rings.map((phase, i) => {
        const cycle = 3.2;
        const local = ((t + phase) % cycle) / cycle;
        const r = 80 + local * 700;
        const op = (1 - local) * 0.25;
        return (
          <div key={i} style={{
            position: 'absolute', left: '50%', top: '42%',
            width: r * 2, height: r * 2,
            marginLeft: -r, marginTop: -r,
            borderRadius: '50%',
            border: `2px solid ${A.cyan}`,
            opacity: op,
          }}/>
        );
      })}
    </>
  );
}

Object.assign(window, { Scene8_Close });
