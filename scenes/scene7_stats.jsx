// Scene 7 — Carrier DNA big stats. 140 → 165s (25s).
// Huge, confident numeric statements that flip through. Each feels like a poster.

function Scene7_Stats() {
  const { localTime } = useSprite();
  const t = localTime;

  // Four big stat posters, each ~5s. Then a tile summary at end.
  const stats = [
    { big: '100%', sub: 'CUSTOMER-OWNED ACCOUNT TEAM', line: 'DEDICATED · NAMED · REACHABLE', tone: 'cyan' },
    { big: '24 / 7', sub: 'PROACTIVE MONITORING', line: 'EVERY CIRCUIT, EVERY SERVICE, ALWAYS WATCHING', tone: 'white' },
    { big: 'ZERO', sub: 'TIER-ONE CALL CENTERS BETWEEN YOU AND AN ENGINEER', line: 'DIRECT ACCESS, BY DESIGN', tone: 'cyan' },
    { big: 'ONE', sub: 'BILL ACROSS EVERY LOCATION', line: 'AND ONE NUMBER TO CALL', tone: 'white' },
  ];

  const perStat = 4.8;
  const idx = Math.min(stats.length - 1, Math.floor(t / perStat));
  const localStat = t - idx * perStat;

  const exitT = clamp((t - 22.5) / 2, 0, 1);
  const rootOp = 1 - exitT;

  return (
    <div style={{ position: 'absolute', inset: 0, background: A.navy, overflow: 'hidden', opacity: rootOp }}>
      <GridBg color="rgba(0,161,226,0.05)" spacing={80} speed={3}/>
      <ScanGlow color="rgba(0,161,226,0.1)" period={10}/>

      <div style={{
        position: 'absolute', left: 140, top: 120,
        fontFamily: FONT_M, fontSize: 20, letterSpacing: '0.45em',
        color: A.cyan, textTransform: 'uppercase',
      }}>
        // CHAPTER 06 / HOW WE'RE DIFFERENT
      </div>

      <div style={{
        position: 'absolute', right: 140, top: 120,
        fontFamily: FONT_M, fontSize: 16, letterSpacing: '0.35em',
        color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase',
      }}>
        {String(idx + 1).padStart(2, '0')} / {String(stats.length).padStart(2, '0')}
      </div>

      {/* progress tick marks */}
      <div style={{
        position: 'absolute', left: 140, right: 140, top: 200,
        display: 'flex', gap: 8, height: 3,
      }}>
        {stats.map((_, i) => (
          <div key={i} style={{
            flex: 1, background: 'rgba(255,255,255,0.12)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: A.cyan,
              transform: `scaleX(${i < idx ? 1 : i === idx ? clamp(localStat / perStat, 0, 1) : 0})`,
              transformOrigin: 'left',
            }}/>
          </div>
        ))}
      </div>

      {/* Current stat */}
      <StatPoster stat={stats[idx]} local={localStat} dur={perStat}/>

      <CornerMark/>
      <LiveBadge/>
    </div>
  );
}

function StatPoster({ stat, local, dur }) {
  const entry = Easing.easeOutQuart(clamp(local / 0.8, 0, 1));
  const exit = Easing.easeInCubic(clamp((local - (dur - 0.6)) / 0.6, 0, 1));
  const op = entry * (1 - exit);
  const ty = (1 - entry) * 40 + exit * -20;

  const bigColor = stat.tone === 'cyan' ? A.cyan : A.white;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op }}>
      <div style={{
        position: 'absolute', left: 140, top: 320,
        transform: `translateY(${ty}px)`,
      }}>
        <div style={{
          fontFamily: FONT_H, fontWeight: 700,
          fontSize: 420,
          color: bigColor, letterSpacing: '-0.04em', lineHeight: 0.9,
          textShadow: stat.tone === 'cyan' ? `0 0 80px rgba(0,161,226,0.35)` : 'none',
        }}>
          {stat.big}
        </div>
      </div>

      <div style={{
        position: 'absolute', left: 140, right: 140, top: 820,
        transform: `translateY(${ty}px)`,
      }}>
        <div style={{
          fontFamily: FONT_H, fontWeight: 300, fontSize: 56,
          color: A.white, letterSpacing: '-0.01em', lineHeight: 1.05,
          maxWidth: 1400,
        }}>
          {stat.sub}
        </div>
        <div style={{
          fontFamily: FONT_M, fontSize: 18, letterSpacing: '0.3em',
          color: A.cyan, textTransform: 'uppercase',
          marginTop: 24,
          display: 'flex', alignItems: 'center', gap: 20,
        }}>
          <span style={{
            width: Easing.easeOutQuart(clamp((local - 0.4) / 0.8, 0, 1)) * 80,
            height: 2, background: A.cyan,
          }}/>
          {stat.line}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Scene7_Stats });
