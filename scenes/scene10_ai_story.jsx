// Scene 10 — The AI story after the intro:
// Slide A (0-12s): the problem — generic software fits no one; AI changed the math.
// Slide B (12-24s): the portfolio wall (IntelPortfolio, exported from scene 9).
// Slide C (24-37s): Your AI Department.

function Scene10_AIStory() {
  const { localTime } = useSprite();
  const t = localTime;
  const exitT = clamp((t - 35.4) / 1.6, 0, 1);
  const rootOp = 1 - exitT;

  return (
    <div style={{ position: 'absolute', inset: 0, background: A.navy, overflow: 'hidden', opacity: rootOp }}>
      <GridBg color="rgba(0,161,226,0.05)" spacing={85} speed={4}/>
      <ScanGlow color="rgba(0,161,226,0.09)" period={11}/>

      <div style={{
        position: 'absolute', left: 140, top: 120,
        fontFamily: FONT_M, fontSize: 20, letterSpacing: '0.45em',
        color: A.cyan, textTransform: 'uppercase',
        opacity: clamp(t / 1, 0, 1),
      }}>
        // CHAPTER 07 / ASEVA INTELLIGENCE
      </div>

      <ProblemSlide t={t}/>
      <PortfolioWall t={t} start={12}/>
      <DepartmentSlide t={t} start={24}/>

      <CornerMark/>
      <LiveBadge/>
    </div>
  );
}

function ProblemSlide({ t }) {
  const local = t;
  if (local > 12.5) return null;
  const exit = Easing.easeInCubic(clamp((local - 11.2) / 0.8, 0, 1));

  const l1 = Easing.easeOutCubic(clamp((local - 0.5) / 0.9, 0, 1));
  const l2 = Easing.easeOutCubic(clamp((local - 2.2) / 0.9, 0, 1));
  const l3 = Easing.easeOutCubic(clamp((local - 5.5) / 1.0, 0, 1));
  const barW = Easing.easeOutQuart(clamp((local - 5.2) / 1.2, 0, 1)) * 480;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - exit }}>
      <div style={{
        position: 'absolute', left: 140, top: 260,
        opacity: l1, transform: `translateY(${(1 - l1) * 30}px)`,
      }}>
        <div style={{
          fontFamily: FONT_H, fontWeight: 300, fontSize: 96,
          color: A.white, letterSpacing: '-0.03em', lineHeight: 1.05,
        }}>software built for everyone</div>
        <div style={{
          fontFamily: FONT_H, fontWeight: 700, fontSize: 128,
          color: A.white, letterSpacing: '-0.035em', lineHeight: 1.05, marginTop: 4,
          opacity: l2, transform: `translateY(${(1 - l2) * 20}px)`,
        }}>fits <span style={{ color: A.cyan }}>no one</span>.</div>
      </div>

      <div style={{
        position: 'absolute', left: 140, top: 640,
        width: barW, height: 3, background: A.cyan,
        boxShadow: `0 0 18px ${A.cyan}`,
      }}/>

      <div style={{
        position: 'absolute', left: 140, top: 680, right: 240,
        opacity: l3, transform: `translateY(${(1 - l3) * 24}px)`,
      }}>
        <div style={{
          fontFamily: FONT_H, fontWeight: 300, fontSize: 54,
          color: 'rgba(255,255,255,0.85)', letterSpacing: '-0.015em', lineHeight: 1.25,
          maxWidth: 1500,
        }}>
          For the first time, a company of any size can afford software
          and agents built around <span style={{ color: A.cyan, fontWeight: 600 }}>exactly how it works</span>.
        </div>
        <div style={{
          fontFamily: FONT_M, fontSize: 18, letterSpacing: '0.3em',
          color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', marginTop: 30,
        }}>
          AI CHANGED THE MATH · ASEVA.AI
        </div>
      </div>
    </div>
  );
}

// Portfolio wall — wraps IntelPortfolio (from scene 9) with an exit fade.
function PortfolioWall({ t, start }) {
  const local = t - start;
  if (local < -0.3 || local > 12.4) return null;
  const exit = Easing.easeInCubic(clamp((local - 11.4) / 0.8, 0, 1));
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - exit }}>
      <IntelPortfolio t={t} start={start}/>
    </div>
  );
}

function DepartmentSlide({ t, start }) {
  const local = t - start;
  if (local < -0.3) return null;

  const head = Easing.easeOutCubic(clamp(local / 0.9, 0, 1));
  const sub = Easing.easeOutCubic(clamp((local - 1.4) / 0.9, 0, 1));

  const items = [
    { k: 'QUARTERLY', d: 'ROADMAP REFRESH AS AI MOVES' },
    { k: 'MONTHLY', d: 'WORKING SESSION WITH LEADERSHIP' },
    { k: 'ONGOING', d: 'NEW APPS AND AGENTS AS NEEDS SURFACE' },
    { k: 'ALWAYS', d: 'SUPPORT ON EVERYTHING ALREADY RUNNING' },
    { k: 'MARKET WATCH', d: 'BUY RIGHT, NEVER TWICE' },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{
        position: 'absolute', left: 140, top: 210,
        opacity: head,
      }}>
        <div style={{
          fontFamily: FONT_H, fontWeight: 300, fontSize: 84,
          color: A.white, letterSpacing: '-0.03em', lineHeight: 1,
        }}>Aseva Intelligence:</div>
        <div style={{
          fontFamily: FONT_H, fontWeight: 700, fontSize: 140,
          color: A.cyan, letterSpacing: '-0.035em', lineHeight: 1, marginTop: 6,
        }}>your AI department.</div>
      </div>

      <div style={{
        position: 'absolute', left: 140, top: 470, right: 240,
        opacity: sub, transform: `translateY(${(1 - sub) * 20}px)`,
        fontFamily: FONT_H, fontWeight: 300, fontSize: 44,
        color: 'rgba(255,255,255,0.85)', letterSpacing: '-0.01em', lineHeight: 1.3,
        maxWidth: 1450,
      }}>
        A dedicated AI leadership team — strategists, engineers, and operators —
        <span style={{ color: A.cyan, fontWeight: 600 }}> for a fraction of a single executive hire</span>.
      </div>

      <div style={{
        position: 'absolute', left: 140, right: 140, top: 660,
        display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18,
      }}>
        {items.map((it, i) => {
          const entry = Easing.easeOutQuart(clamp((local - 3.0 - i * 0.5) / 0.7, 0, 1));
          return (
            <div key={i} style={{
              opacity: entry, transform: `translateY(${(1 - entry) * 40}px)`,
              borderTop: `2px solid ${A.cyan}`, paddingTop: 18,
            }}>
              <div style={{
                fontFamily: FONT_H, fontWeight: 700, fontSize: 34,
                color: A.white, letterSpacing: '-0.01em', lineHeight: 1,
                whiteSpace: 'nowrap',
              }}>{it.k}</div>
              <div style={{
                fontFamily: FONT_M, fontSize: 13, letterSpacing: '0.16em',
                color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase',
                marginTop: 12, lineHeight: 1.7,
              }}>{it.d}</div>
            </div>
          );
        })}
      </div>

      <div style={{
        position: 'absolute', left: 140, right: 140, bottom: 90,
        display: 'flex', justifyContent: 'space-between',
        fontFamily: FONT_M, fontSize: 14, letterSpacing: '0.3em',
        color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase',
        opacity: clamp((local - 6) / 1, 0, 1),
      }}>
        <span>STRATEGY, ENGINEERS, AND SUPPORT</span>
        <span style={{ color: A.cyan }}>◆</span>
        <span>ASEVA.AI</span>
      </div>
    </div>
  );
}

Object.assign(window, { Scene10_AIStory });
