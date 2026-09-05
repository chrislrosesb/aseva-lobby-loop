// Scene 1 — Cold open: a pulse of light traces across black, then resolves
// into the ASEVA wordmark. 0 → 15s.

function Scene1_Open() {
  const { localTime, progress, duration } = useSprite();

  // Traveling pulse: from x = -200 to x = 2100 over first 5s
  const pulseT = clamp(localTime / 5, 0, 1);
  const pulseX = Easing.easeInOutCubic(pulseT) * 2300 - 200;
  const pulseOp = pulseT < 0.9 ? 1 : (1 - (pulseT - 0.9) / 0.1);

  // Horizon line reveal
  const lineT = Easing.easeOutQuart(clamp((localTime - 0.2) / 4.5, 0, 1));
  const lineW = lineT * 1920;

  // "ASEVA" slams in at 5.5s
  const nameT = clamp((localTime - 5.5) / 1.2, 0, 1);
  const nameOp = Easing.easeOutCubic(nameT);
  const nameBlur = (1 - Easing.easeOutCubic(nameT)) * 20;
  const nameScale = 0.96 + Easing.easeOutCubic(nameT) * 0.04;

  // subtitle reveal at 7.5s
  const subT = clamp((localTime - 7.8) / 1.2, 0, 1);

  // Exit flourish: everything drifts up + fades at t > 13
  const exitT = clamp((localTime - 13) / 2, 0, 1);
  const exitY = -Easing.easeInCubic(exitT) * 80;
  const exitOp = 1 - Easing.easeInCubic(exitT);

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#000', overflow: 'hidden' }}>
      {/* radial vignette */}
      <div style={{ position:'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 55%, #0a1a2e 0%, #000 70%)' }}/>

      {/* subtle starfield */}
      <StarField time={localTime} count={80}/>

      {/* Traveling pulse along a horizontal axis */}
      <div style={{
        position: 'absolute', left: pulseX, top: 540,
        width: 280, height: 4, marginTop: -2,
        background: `linear-gradient(90deg, transparent 0%, ${A.cyan} 50%, transparent 100%)`,
        opacity: pulseOp,
        filter: `blur(1px) drop-shadow(0 0 20px ${A.cyan}) drop-shadow(0 0 40px ${A.cyan})`,
      }}/>

      {/* Horizon line grows behind the pulse */}
      <div style={{
        position: 'absolute', left: 0, top: 540,
        width: lineW, height: 1, marginTop: -0.5,
        background: `linear-gradient(90deg, transparent, ${A.cyan}66, ${A.cyan}, ${A.cyan}66, transparent)`,
        opacity: 0.6,
      }}/>

      {/* Wordmark — horizontal logo, tinted white on dark */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: `translate(-50%, calc(-50% + ${exitY}px)) scale(${nameScale})`,
        opacity: nameOp * exitOp,
        filter: `drop-shadow(0 0 30px rgba(0,161,226,0.4))`,
      }}>
        <div style={{ filter: `blur(${nameBlur}px)` }}>
          <img src={window.__resources.logoHorizontal} alt="Aseva" style={{
            width: 920, height: 'auto', display: 'block',
            filter: 'brightness(0) invert(1)',
          }}/>
        </div>
      </div>

      {/* Thin cyan accent bar under wordmark */}
      <div style={{
        position: 'absolute', left: '50%', top: 'calc(50% + 145px)',
        width: Easing.easeOutQuart(clamp((localTime - 6.2)/1.2, 0, 1)) * 320,
        height: 3, marginLeft: -160,
        background: A.cyan,
        opacity: (1 - clamp((localTime - 13)/2, 0, 1)),
        boxShadow: `0 0 20px ${A.cyan}`,
      }}/>

      {/* Subtitle */}
      <div style={{
        position: 'absolute', left: '50%', top: 'calc(50% + 190px)',
        transform: `translate(-50%, ${(1 - Easing.easeOutCubic(subT)) * 20 + exitY}px)`,
        opacity: Easing.easeOutCubic(subT) * exitOp,
        fontFamily: FONT_M, fontSize: 22, letterSpacing: '0.5em',
        color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase',
      }}>
        CYBERSECURITY · VOICE · NETWORKING
      </div>

      {/* Corner timestamp label for ambience (appears after pulse passes) */}
      <div style={{
        position: 'absolute', left: 64, top: 48,
        fontFamily: FONT_M, fontSize: 14, letterSpacing: '0.3em',
        color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase',
        opacity: clamp((localTime - 5.5) / 1.5, 0, 1) * exitOp,
      }}>
        SANTA BARBARA · EST. 1995
      </div>
      <div style={{
        position: 'absolute', right: 64, top: 48,
        fontFamily: FONT_M, fontSize: 14, letterSpacing: '0.3em',
        color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase',
        opacity: clamp((localTime - 5.5) / 1.5, 0, 1) * exitOp,
      }}>
        TRANSMISSION 01
      </div>
    </div>
  );
}

function StarField({ time, count = 60 }) {
  const stars = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: Math.random() * 1920,
        y: Math.random() * 1080,
        r: Math.random() * 1.4 + 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.5,
      });
    }
    return arr;
  }, [count]);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {stars.map((s, i) => {
        const op = 0.2 + 0.4 * (0.5 + 0.5 * Math.sin(time * s.speed + s.phase));
        return (
          <div key={i} style={{
            position: 'absolute', left: s.x, top: s.y,
            width: s.r * 2, height: s.r * 2,
            background: '#fff', borderRadius: '50%',
            opacity: op,
          }}/>
        );
      })}
    </div>
  );
}

Object.assign(window, { Scene1_Open });
