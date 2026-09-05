// Scene 6 — Capability grid. 115 → 127s (12s).
// A stacking / rolling grid of what Aseva does. Feels like a dashboard coming alive.

function Scene6_Grid() {
  const { localTime } = useSprite();
  const t = localTime;

  const categories = [
    { n: '01', title: 'CYBERSECURITY', items: ['NETWORK', 'ENDPOINT', 'IDENTITY', 'EMAIL', 'MONITORING'] },
    { n: '02', title: 'VOICE', items: ['HOSTED PLATFORM', 'MICROSOFT TEAMS', 'CONTACT CENTER', 'CONFERENCING'] },
    { n: '03', title: 'NETWORKING', items: ['FIBER', 'SD-WAN', 'SASE', 'FIREWALLS', 'MANAGED WI-FI'] },
    { n: '04', title: 'CONSULTING', items: ['ARCHITECTURE', 'MIGRATIONS', 'IMPLEMENTATION', 'RUN-TIME OPS'] },
  ];

  const headerT = clamp(t / 1.2, 0, 1);
  const exitT = clamp((t - 10.5) / 1.5, 0, 1);
  const rootOp = 1 - exitT;

  // Sweep: one pass across columns only. Starts at t=4, each column dwells DWELL seconds.
  const SWEEP_START = 4;
  const DWELL = 1.5;
  const rawIdx = Math.floor((t - SWEEP_START) / DWELL);
  const sweepIdx = t >= SWEEP_START && rawIdx < categories.length ? rawIdx : -1;

  return (
    <div style={{ position: 'absolute', inset: 0, background: A.navyDeep, overflow: 'hidden', opacity: rootOp }}>
      <GridBg color="rgba(0,161,226,0.05)" spacing={60} speed={2}/>

      <div style={{
        position: 'absolute', left: 140, top: 120,
        fontFamily: FONT_M, fontSize: 20, letterSpacing: '0.45em',
        color: A.cyan, textTransform: 'uppercase',
        opacity: headerT,
      }}>
        // CHAPTER 05 / FULL STACK
      </div>

      <div style={{
        position: 'absolute', left: 140, top: 170,
        opacity: headerT,
      }}>
        <div style={{
          fontFamily: FONT_H, fontWeight: 300, fontSize: 100,
          color: A.white, letterSpacing: '-0.035em', lineHeight: 1,
        }}>
          one team,
        </div>
        <div style={{
          fontFamily: FONT_H, fontWeight: 700, fontSize: 120,
          color: A.cyan, letterSpacing: '-0.04em', lineHeight: 1,
          marginTop: 2,
        }}>
          the whole stack.
        </div>
      </div>

      {/* Grid */}
      <div style={{
        position: 'absolute', left: 140, right: 140, top: 530,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 20,
      }}>
        {categories.map((c, i) => {
          const startT = 1.8 + i * 0.35;
          const entry = Easing.easeOutQuart(clamp((t - startT) / 0.8, 0, 1));
          const op = entry;
          const ty = (1 - entry) * 60;
          const highlighted = sweepIdx === i;

          return (
            <div key={i} style={{
              position: 'relative',
              opacity: op,
              transform: `translateY(${ty}px)`,
              background: highlighted ? 'rgba(0,161,226,0.14)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${highlighted ? A.cyan : 'rgba(255,255,255,0.12)'}`,
              padding: '28px 28px 24px',
              minHeight: 380,
              transition: 'background 0.25s, border-color 0.25s',
            }}>
              <div style={{
                fontFamily: FONT_M, fontSize: 16, letterSpacing: '0.35em',
                color: highlighted ? A.cyan : 'rgba(255,255,255,0.5)',
                marginBottom: 20,
              }}>{c.n} / PILLAR</div>

              <div style={{
                fontFamily: FONT_H, fontWeight: 700, fontSize: 44,
                color: A.white, letterSpacing: '-0.02em', lineHeight: 1,
                marginBottom: 28,
              }}>{c.title}</div>

              <div style={{
                display: 'flex', flexDirection: 'column', gap: 10,
              }}>
                {c.items.map((it, j) => {
                  const itemT = clamp((t - startT - 0.5 - j * 0.12) / 0.4, 0, 1);
                  return (
                    <div key={j} style={{
                      opacity: itemT,
                      transform: `translateX(${(1 - itemT) * -14}px)`,
                      display: 'flex', alignItems: 'center', gap: 12,
                      fontFamily: FONT_M, fontSize: 16, letterSpacing: '0.18em',
                      color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase',
                    }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: A.cyan,
                        boxShadow: highlighted ? `0 0 10px ${A.cyan}` : 'none',
                      }}/>
                      {it}
                    </div>
                  );
                })}
              </div>

              {/* corner bracket */}
              <div style={{
                position: 'absolute', top: 12, right: 12,
                width: 16, height: 16,
                borderTop: `2px solid ${A.cyan}`,
                borderRight: `2px solid ${A.cyan}`,
                opacity: highlighted ? 1 : 0.3,
              }}/>
              <div style={{
                position: 'absolute', bottom: 12, left: 12,
                width: 16, height: 16,
                borderBottom: `2px solid ${A.cyan}`,
                borderLeft: `2px solid ${A.cyan}`,
                opacity: highlighted ? 1 : 0.3,
              }}/>
            </div>
          );
        })}
      </div>

      {/* bottom ticker */}
      <div style={{
        position: 'absolute', left: 140, right: 140, bottom: 90,
        display: 'flex', justifyContent: 'space-between',
        fontFamily: FONT_M, fontSize: 14, letterSpacing: '0.3em',
        color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase',
        opacity: clamp((t - 5) / 1, 0, 1),
      }}>
        <span>ONE BILL</span>
        <span style={{ color: A.cyan }}>◆</span>
        <span>ONE NUMBER TO CALL</span>
        <span style={{ color: A.cyan }}>◆</span>
        <span>ONE ACCOUNTABLE TEAM</span>
        <span style={{ color: A.cyan }}>◆</span>
        <span>EVERY LOCATION, EVERY SERVICE</span>
      </div>

      <CornerMark/>
      <LiveBadge/>
    </div>
  );
}

Object.assign(window, { Scene6_Grid });
