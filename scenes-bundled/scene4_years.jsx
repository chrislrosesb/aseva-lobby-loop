// Scene 4 — 30 years. 65 → 90s (25s).
// A kinetic year counter from 1995 to 2026 with milestones flashing by,
// settles on "30 YEARS" with supporting stats.

function Scene4_Years() {
  const { localTime, duration } = useSprite();
  const t = localTime;

  // Milestones with explicit per-milestone dwell windows.
  // dwellStart→dwellEnd = seconds in scene where the year is pinned on this milestone.
  // Between consecutive milestones, the year smoothly interpolates.
  const milestones = [
    { year: 1995, text: 'FOUNDED IN SANTA BARBARA', dwell: 1.8 },
    { year: 1998, text: 'FIRST CONNECTIVITY CIRCUIT', dwell: 1.6 },
    { year: 2002, text: 'HOSTED VOIP PIONEER', dwell: 1.5 },
    { year: 2016, text: 'ASEVA FIBER NETWORK', dwell: 1.5 },
    { year: 2018, text: 'CYBERSECURITY PRACTICE', dwell: 1.5 },
    { year: 2021, text: 'CISCO WEBEX PARTNERSHIP', dwell: 1.5 },
    { year: 2022, text: 'CATO FLAGSHIP PARTNER', dwell: 1.5 },
    { year: 2025, text: 'REBRAND TO ASEVA', dwell: 1.5 },
    { year: 2026, text: 'STILL BUILDING', dwell: 1.2 },
  ];

  // Build a timeline: t0 = 0.4s pre-roll, then for each milestone:
  // - transition window (0.55s) moving to that year
  // - dwell window (milestone.dwell) pinned on that year
  const preRoll = 0.4;
  const transition = 0.55;
  const keys = [];
  let cursor = preRoll;
  milestones.forEach((m, i) => {
    if (i === 0) {
      // Start pinned on first year through its dwell
      keys.push({ t: cursor, year: m.year });
      cursor += m.dwell;
      keys.push({ t: cursor, year: m.year });
    } else {
      cursor += transition;
      keys.push({ t: cursor, year: m.year });
      cursor += m.dwell;
      keys.push({ t: cursor, year: m.year });
    }
  });
  const counterEnd = cursor; // end of timeline

  // Resolve current year from piecewise linear-with-easing keys.
  let year = milestones[0].year;
  let currentMilestone = milestones[0];
  if (t <= preRoll) {
    year = milestones[0].year;
  } else if (t >= counterEnd) {
    year = milestones[milestones.length - 1].year;
    currentMilestone = milestones[milestones.length - 1];
  } else {
    for (let i = 0; i < keys.length - 1; i++) {
      const a = keys[i], b = keys[i + 1];
      if (t >= a.t && t <= b.t) {
        if (a.year === b.year) {
          year = a.year;
          currentMilestone = milestones.find(m => m.year === a.year) || currentMilestone;
        } else {
          const localP = (t - a.t) / (b.t - a.t);
          const eased = Easing.easeInOutCubic(clamp(localP, 0, 1));
          year = Math.round(a.year + (b.year - a.year) * eased);
          // Current milestone = the most recent dwell-target reached
          currentMilestone = milestones.find(m => m.year === a.year) || currentMilestone;
          if (eased > 0.5) {
            currentMilestone = milestones.find(m => m.year === b.year) || currentMilestone;
          }
        }
        break;
      }
    }
  }

  // Slam kicks in after counter finishes.
  const slamStart = counterEnd + 0.4;
  const slamT = clamp((t - slamStart) / 1.2, 0, 1);
  const slamScale = 0.7 + Easing.easeOutBack(slamT) * 0.3;
  const slamOp = slamT;

  // Counter fades out when slam arrives.
  const counterOp = 1 - clamp((t - (slamStart - 0.4)) / 0.6, 0, 1);

  // Progress fraction for the year scale bar (0..1 across 1995→2026).
  const yearProgress = clamp((year - 1995) / 31, 0, 1);

  return (
    <div style={{ position: 'absolute', inset: 0, background: A.navy, overflow: 'hidden' }}>
      <GridBg color="rgba(0,161,226,0.05)" spacing={90} speed={4}/>

      {/* Chapter label */}
      <div style={{
        position: 'absolute', left: 140, top: 120,
        fontFamily: FONT_M, fontSize: 20, letterSpacing: '0.45em',
        color: A.cyan, textTransform: 'uppercase',
        opacity: clamp(t / 1, 0, 1),
      }}>
        // CHAPTER 03 / TIMELINE
      </div>

      {/* Ticking year counter */}
      <div style={{
        position: 'absolute', left: '50%', top: '42%',
        transform: 'translate(-50%, -50%)',
        opacity: counterOp,
        fontFamily: FONT_M, fontSize: 340, fontWeight: 700,
        color: A.white, letterSpacing: '0.02em', lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
        textShadow: `0 0 40px rgba(0,161,226,0.3)`,
      }}>
        {year}
      </div>

      {/* Year scale */}
      <div style={{
        position: 'absolute', left: 140, right: 140, top: '65%',
        opacity: counterOp * clamp(t / 1.2, 0, 1),
      }}>
        <div style={{ position: 'relative', height: 60 }}>
          <div style={{
            position: 'absolute', left: 0, right: 0, top: 30,
            height: 1, background: 'rgba(255,255,255,0.15)',
          }}/>
          <div style={{
            position: 'absolute', left: 0, top: 30,
            width: `${yearProgress * 100}%`, height: 2,
            background: A.cyan, boxShadow: `0 0 12px ${A.cyan}`,
          }}/>
          {/* Milestone ticks */}
          {milestones.map((m, i) => {
            const p = (m.year - 1995) / 31;
            const reached = year >= m.year;
            const fadeIn = reached ? 1 : 0.5;
            return (
              <div key={i} style={{
                position: 'absolute', left: `${p * 100}%`, top: 0,
                transform: 'translateX(-50%)',
                opacity: fadeIn,
              }}>
                <div style={{
                  width: 2, height: 20,
                  margin: '20px auto 6px',
                  background: reached ? A.cyan : 'rgba(255,255,255,0.3)',
                }}/>
                <div style={{
                  fontFamily: FONT_M, fontSize: 11, letterSpacing: '0.15em',
                  color: reached ? A.cyan : 'rgba(255,255,255,0.4)',
                  textTransform: 'uppercase', textAlign: 'center',
                  whiteSpace: 'nowrap',
                  transform: 'translateX(-0%)',
                  marginTop: 4,
                }}>{m.year}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Most-recent-milestone ticker */}
      <CurrentMilestone current={currentMilestone} counterOp={counterOp}/>

      {/* THE SLAM: 30 YEARS */}
      <Slam t={t} slamStart={slamStart} slamT={slamT} slamScale={slamScale} slamOp={slamOp}/>

      <CornerMark/>
      <LiveBadge/>
    </div>
  );
}

function CurrentMilestone({ current, counterOp }) {
  if (!current) return null;
  return (
    <div style={{
      position: 'absolute', left: 140, top: '78%',
      opacity: counterOp * 0.85,
      fontFamily: FONT_M, fontSize: 28, letterSpacing: '0.3em',
      color: A.white, textTransform: 'uppercase',
    }}>
      <span style={{ color: A.cyan }}>▸</span>&nbsp;&nbsp;{current.text}
    </div>
  );
}

function Slam({ t, slamStart, slamT, slamScale, slamOp }) {
  if (slamT <= 0) return null;
  const local = t - slamStart;

  // Stats fade in after main slam
  const statsT = Easing.easeOutCubic(clamp((local - 1.5) / 1.5, 0, 1));

  return (
    <div style={{
      position: 'absolute', inset: 0,
      opacity: slamOp,
    }}>
      <div style={{
        position: 'absolute', left: '50%', top: '38%',
        transform: `translate(-50%, -50%) scale(${slamScale})`,
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: FONT_H, fontWeight: 700, fontSize: 380,
          color: A.white, letterSpacing: '-0.04em', lineHeight: 0.9,
        }}>
          30
        </div>
        <div style={{
          fontFamily: FONT_H, fontWeight: 300, fontSize: 140,
          color: A.cyan, letterSpacing: '0.15em', lineHeight: 1,
          textTransform: 'uppercase', marginTop: -20,
        }}>
          years
        </div>
      </div>

      {/* Stats underneath */}
      <div style={{
        position: 'absolute', left: 140, right: 140, top: '75%',
        display: 'flex', justifyContent: 'space-between', gap: 40,
        opacity: statsT,
        transform: `translateY(${(1 - statsT) * 40}px)`,
      }}>
        {[
          { v: '1,000+', l: 'CUSTOMERS TODAY' },
          { v: '3,000', l: 'IN OUR HISTORY' },
          { v: '25+ YRS', l: 'AVG LEADERSHIP TENURE' },
          { v: '10+ YRS', l: 'TYPICAL CUSTOMER' },
        ].map((s, i) => (
          <div key={i} style={{
            flex: 1,
            borderTop: `2px solid ${i === 0 ? A.cyan : 'rgba(255,255,255,0.25)'}`,
            paddingTop: 20,
          }}>
            <div style={{
              fontFamily: FONT_H, fontWeight: 700, fontSize: 64,
              color: A.white, letterSpacing: '-0.02em', lineHeight: 1,
            }}>{s.v}</div>
            <div style={{
              fontFamily: FONT_M, fontSize: 14, letterSpacing: '0.25em',
              color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase',
              marginTop: 10,
            }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { Scene4_Years });
