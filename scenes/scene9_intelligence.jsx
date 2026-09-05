// Scene 9 — Aseva Intelligence intro + five capabilities. ~17.5s.

function Scene9_Intelligence() {
  const { localTime } = useSprite();
  const t = localTime;
  // 0-6: intro slam. 6-20: five capabilities. 20-20.5: exit.
  const exitT = clamp((t - 19.4) / 0.9, 0, 1);
  const rootOp = 1 - exitT;

  return (
    <div style={{ position: 'absolute', inset: 0, background: A.navyDeep, overflow: 'hidden', opacity: rootOp }}>
      <GridBg color="rgba(0,161,226,0.06)" spacing={80} speed={5}/>
      <ScanGlow color="rgba(0,161,226,0.1)" period={9}/>

      <div style={{
        position: 'absolute', left: 140, top: 120,
        fontFamily: FONT_M, fontSize: 20, letterSpacing: '0.45em',
        color: A.cyan, textTransform: 'uppercase',
        opacity: clamp(t / 1, 0, 1),
      }}>
        // CHAPTER 07 / ASEVA INTELLIGENCE
      </div>

      <IntelIntro t={t}/>
      <IntelPillars t={t} start={6}/>

      <CornerMark/>
      <LiveBadge/>
    </div>
  );
}

function IntelIntro({ t }) {
  const entry = Easing.easeOutQuart(clamp((t - 0.4) / 1.0, 0, 1));
  const exit = Easing.easeInCubic(clamp((t - 5.2) / 0.8, 0, 1));
  const op = entry * (1 - exit);
  const sub = Easing.easeOutCubic(clamp((t - 1.6) / 0.9, 0, 1));
  const barW = Easing.easeOutQuart(clamp((t - 1.2) / 1.0, 0, 1)) * 560;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op }}>
      <div style={{
        position: 'absolute', left: 140, top: 330,
        transform: `translateX(${(1 - entry) * -120}px)`,
      }}>
        <div style={{
          fontFamily: FONT_H, fontWeight: 300, fontSize: 110,
          color: A.white, letterSpacing: '-0.03em', lineHeight: 1,
        }}>introducing</div>
        <div style={{
          fontFamily: FONT_H, fontWeight: 700, fontSize: 190,
          color: A.white, letterSpacing: '-0.035em', lineHeight: 1, marginTop: 8,
          whiteSpace: 'nowrap',
        }}>ASEVA <span style={{ color: A.cyan }}>INTELLIGENCE</span></div>
      </div>
      <div style={{
        position: 'absolute', left: 140, top: 680,
        width: barW, height: 4, background: A.cyan,
        boxShadow: `0 0 24px ${A.cyan}`,
      }}/>
      <div style={{
        position: 'absolute', left: 140, top: 712,
        opacity: sub, transform: `translateY(${(1 - sub) * 20}px)`,
        fontFamily: FONT_M, fontSize: 26, letterSpacing: '0.3em',
        color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase',
      }}>
        AI, PUT TO WORK · ASEVA.AI
      </div>
    </div>
  );
}

function IntelPillars({ t, start }) {
  const local = t - start;
  if (local < -0.3 || local > 14.4) return null;
  const exit = Easing.easeInCubic(clamp((local - 13.4) / 0.8, 0, 1));

  const items = [
    { n: '01', title: 'STRATEGY', line: 'WHERE AI PAYS OFF, RANKED' },
    { n: '02', title: 'RECOMMEND', line: 'THE RIGHT TOOL, NOT A PITCH' },
    { n: '03', title: 'BUILD', line: "CUSTOM APPLICATIONS THAT MEET A BUSINESS'S EXACT NEEDS" },
    { n: '04', title: 'AUTOMATE', line: 'AGENTS THAT OWN WHOLE JOBS' },
    { n: '05', title: 'SECURE + RUN', line: 'HOSTED, LOCKED DOWN, WATCHED' },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - exit }}>
      <div style={{
        position: 'absolute', left: 140, top: 210,
        opacity: Easing.easeOutCubic(clamp(local / 0.8, 0, 1)),
      }}>
        <div style={{
          fontFamily: FONT_H, fontWeight: 300, fontSize: 84,
          color: A.white, letterSpacing: '-0.03em', lineHeight: 1,
        }}>we find where AI pays off,</div>
        <div style={{
          fontFamily: FONT_H, fontWeight: 700, fontSize: 96,
          color: A.cyan, letterSpacing: '-0.035em', lineHeight: 1, marginTop: 4,
        }}>then we make it real.</div>
      </div>

      <div style={{
        position: 'absolute', left: 140, right: 140, top: 480,
        display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18,
      }}>
        {items.map((it, i) => {
          const entry = Easing.easeOutQuart(clamp((local - 1.6 - i * 0.55) / 0.8, 0, 1));
          const sweepIdx = Math.floor(((local - 4.5) / 1.68) % items.length);
          const hot = local > 5 && sweepIdx === i;
          return (
            <div key={i} style={{
              opacity: entry, transform: `translateY(${(1 - entry) * 50}px)`,
              background: hot ? 'rgba(0,161,226,0.14)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${hot ? A.cyan : 'rgba(255,255,255,0.12)'}`,
              padding: '26px 24px', minHeight: 300,
              transition: 'background 0.25s, border-color 0.25s',
              position: 'relative',
            }}>
              <div style={{
                fontFamily: FONT_M, fontSize: 15, letterSpacing: '0.3em',
                color: hot ? A.cyan : 'rgba(255,255,255,0.5)', marginBottom: 18,
              }}>{it.n}</div>
              <div style={{
                fontFamily: FONT_H, fontWeight: 700, fontSize: 38,
                color: A.white, letterSpacing: '-0.015em', lineHeight: 1.05,
                marginBottom: 18,
              }}>{it.title}</div>
              <div style={{
                fontFamily: FONT_M, fontSize: 15, letterSpacing: '0.14em',
                color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase',
                lineHeight: 1.6,
              }}>{it.line}</div>
              <div style={{
                position: 'absolute', bottom: 12, left: 12,
                width: 14, height: 14,
                borderBottom: `2px solid ${A.cyan}`, borderLeft: `2px solid ${A.cyan}`,
                opacity: hot ? 1 : 0.3,
              }}/>
            </div>
          );
        })}
      </div>

      <div style={{
        position: 'absolute', left: 140, right: 140, bottom: 90,
        display: 'flex', justifyContent: 'space-between',
        fontFamily: FONT_M, fontSize: 14, letterSpacing: '0.3em',
        color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase',
        opacity: clamp((local - 4.5) / 1, 0, 1),
      }}>
        <span>YOUR FRACTIONAL AI DEPARTMENT</span>
        <span style={{ color: A.cyan }}>◆</span>
        <span>STRATEGY THROUGH PRODUCTION</span>
        <span style={{ color: A.cyan }}>◆</span>
        <span>ASEVA.AI</span>
      </div>
    </div>
  );
}

function IntelPortfolio({ t, start }) {
  const local = t - start;
  if (local < -0.3) return null;

  // Real production applications from aseva.ai/portfolio.
  const apps = [
    { name: 'NOCFLOW', line: 'PROJECTS THAT NEVER DRIFT' },
    { name: 'MAVIS', line: 'FACILITIES MAINTENANCE' },
    { name: 'ANN', line: 'ENTERPRISE INTELLIGENCE' },
    { name: 'CONDUCTOR', line: 'SECURE AI HOSTING' },
    { name: 'BLUEPRINT', line: 'PROCESS REVIEWS' },
    { name: 'RESOLVE', line: 'ON-CALL ALERTING' },
    { name: 'BILL BUDDY', line: 'INVOICE RECONCILIATION' },
    { name: 'PLURIBUS', line: 'CONTEXT + INSIGHTS' },
    { name: 'NETVIEW', line: 'LIVE NETWORK MAPS' },
  ];

  const headOp = Easing.easeOutCubic(clamp(local / 0.9, 0, 1));

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{
        position: 'absolute', left: 140, top: 190,
        opacity: headOp,
      }}>
        <div style={{
          fontFamily: FONT_H, fontWeight: 300, fontSize: 84,
          color: A.white, letterSpacing: '-0.03em', lineHeight: 1,
        }}>built. shipped.</div>
        <div style={{
          fontFamily: FONT_H, fontWeight: 700, fontSize: 110,
          color: A.cyan, letterSpacing: '-0.035em', lineHeight: 1, marginTop: 6,
        }}>running in production.</div>
      </div>

      <div style={{
        position: 'absolute', left: 140, right: 140, top: 440,
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
      }}>
        {apps.map((a, i) => {
          const entry = Easing.easeOutQuart(clamp((local - 1.0 - i * 0.22) / 0.6, 0, 1));
          const sweepIdx = Math.floor(((local - 4) / 0.9) % apps.length);
          const hot = local > 4.5 && sweepIdx === i;
          return (
            <div key={i} style={{
              opacity: entry, transform: `translateY(${(1 - entry) * 40}px)`,
              display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
              gap: 16,
              background: hot ? 'rgba(0,161,226,0.14)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${hot ? A.cyan : 'rgba(255,255,255,0.12)'}`,
              padding: '22px 24px',
              transition: 'background 0.25s, border-color 0.25s',
            }}>
              <div style={{
                fontFamily: FONT_H, fontWeight: 700, fontSize: 34,
                color: A.white, letterSpacing: '-0.01em', whiteSpace: 'nowrap',
              }}>{a.name}</div>
              <div style={{
                fontFamily: FONT_M, fontSize: 13, letterSpacing: '0.16em',
                color: hot ? A.cyan : 'rgba(255,255,255,0.55)', textTransform: 'uppercase',
                textAlign: 'right', lineHeight: 1.5,
              }}>{a.line}</div>
            </div>
          );
        })}
      </div>

      <div style={{
        position: 'absolute', left: 140, right: 140, bottom: 90,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: FONT_M, fontSize: 15, letterSpacing: '0.3em',
        color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase',
        opacity: clamp((local - 3.5) / 1, 0, 1),
      }}>
        <span>THE FULL PORTFOLIO LIVES AT <span style={{ color: A.cyan }}>ASEVA.AI/PORTFOLIO</span></span>
        <span>AND IT KEEPS GROWING</span>
      </div>
    </div>
  );
}

Object.assign(window, { Scene9_Intelligence, IntelPortfolio });
