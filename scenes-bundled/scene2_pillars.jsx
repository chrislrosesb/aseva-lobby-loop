// Scene 2 — Three pillars. 15 → 40s (25s).
// Big kinetic typography: CYBERSECURITY / VOICE / NETWORKING
// Each word slams in, holds, pushes off as the next arrives. Then all three
// collapse into a single stacked poster layout.

function Scene2_Pillars() {
  const { localTime, duration } = useSprite();

  // Each word occupies a solo window, then they all appear together.
  // 0-5s: "WE HANDLE" intro
  // 5-9: CYBERSECURITY
  // 9-13: VOICE
  // 13-17: NETWORKING
  // 17-25: three-up poster

  const t = localTime;

  return (
    <div style={{ position: 'absolute', inset: 0, background: A.navyDeep, overflow: 'hidden' }}>
      <GridBg color="rgba(0,161,226,0.06)" spacing={90} speed={6}/>
      <ScanGlow color="rgba(0,161,226,0.08)" period={12}/>

      {/* Intro: WE HANDLE */}
      <IntroText t={t}/>

      {/* Solo pillar slams */}
      <PillarSolo t={t} start={5} label="CYBERSECURITY" accent="01" caption="Network · Endpoint · Identity · Email · Monitoring"/>
      <PillarSolo t={t} start={9} label="VOICE" accent="02" caption="ClearStar · Teams · Contact Center"/>
      <PillarSolo t={t} start={13} label="NETWORKING" accent="03" caption="Fiber · SASE · SD-WAN · Managed"/>

      {/* Three-up stacked poster */}
      <ThreeUpPoster t={t} start={17}/>

      <CornerMark/>
    </div>
  );
}

function IntroText({ t }) {
  const op = clamp(t / 0.6, 0, 1) * (1 - clamp((t - 4.2)/0.8, 0, 1));
  const ty = (1 - Easing.easeOutCubic(clamp(t / 0.8, 0, 1))) * 40;
  return (
    <div style={{
      position: 'absolute', left: '50%', top: '50%',
      transform: `translate(-50%, calc(-50% + ${ty}px))`,
      opacity: op, textAlign: 'center',
    }}>
      <div style={{
        fontFamily: FONT_M, fontSize: 22, letterSpacing: '0.45em',
        color: A.cyan, textTransform: 'uppercase', marginBottom: 24,
      }}>
        // CHAPTER 01
      </div>
      <div style={{
        fontFamily: FONT_H, fontSize: 180, fontWeight: 300,
        color: A.white, lineHeight: 1, letterSpacing: '-0.03em',
      }}>
        we handle
      </div>
      <div style={{
        fontFamily: FONT_M, fontSize: 24, letterSpacing: '0.3em',
        color: 'rgba(255,255,255,0.5)', marginTop: 32,
        textTransform: 'uppercase',
      }}>
        three things — all the way through
      </div>
    </div>
  );
}

function PillarSolo({ t, start, label, accent, caption }) {
  const local = t - start;
  if (local < -0.5 || local > 4.2) return null;

  const entry = Easing.easeOutQuart(clamp(local / 0.6, 0, 1));
  const exit = Easing.easeInCubic(clamp((local - 3.6) / 0.6, 0, 1));
  const op = entry * (1 - exit);

  // Horizontal slam: from left, settles, then pushes right on exit
  const tx = (1 - entry) * -180 + exit * 220;

  // Caption comes in slightly delayed
  const capEntry = Easing.easeOutCubic(clamp((local - 0.4) / 0.6, 0, 1));
  const capOp = capEntry * (1 - exit);

  // Accent bar grows across
  const barW = Easing.easeOutQuart(clamp((local - 0.2) / 1.0, 0, 1)) * 720;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op }}>
      {/* accent number, tiny, upper-left of title */}
      <div style={{
        position: 'absolute', left: 140, top: 360,
        fontFamily: FONT_M, fontSize: 24, letterSpacing: '0.4em',
        color: A.cyan,
        transform: `translateX(${tx * 0.3}px)`,
      }}>
        {accent} /
      </div>

      {/* Big label */}
      <div style={{
        position: 'absolute', left: 140, top: 400,
        transform: `translateX(${tx}px)`,
        fontFamily: FONT_H, fontSize: 220, fontWeight: 700,
        color: A.white, lineHeight: 1, letterSpacing: '-0.035em',
        whiteSpace: 'nowrap',
      }}>
        {label}
      </div>

      {/* accent bar */}
      <div style={{
        position: 'absolute', left: 140, top: 640,
        width: barW, height: 4,
        background: A.cyan,
        boxShadow: `0 0 24px ${A.cyan}`,
      }}/>

      {/* caption */}
      <div style={{
        position: 'absolute', left: 140, top: 670,
        opacity: capOp,
        transform: `translateY(${(1 - capEntry) * 20}px)`,
        fontFamily: FONT_M, fontSize: 26, letterSpacing: '0.25em',
        color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase',
      }}>
        {caption}
      </div>

      {/* index dots right-aligned */}
      <div style={{
        position: 'absolute', right: 140, top: 400,
        display: 'flex', flexDirection: 'column', gap: 18,
        fontFamily: FONT_M, fontSize: 18, letterSpacing: '0.35em',
        color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase',
      }}>
        {['01', '02', '03'].map(n => (
          <div key={n} style={{
            display: 'flex', alignItems: 'center', gap: 16,
            color: n === accent ? A.cyan : 'rgba(255,255,255,0.3)',
          }}>
            <span style={{
              width: n === accent ? 40 : 18, height: 2,
              background: n === accent ? A.cyan : 'rgba(255,255,255,0.3)',
              transition: 'width 0.3s',
            }}/>
            {n}
          </div>
        ))}
      </div>
    </div>
  );
}

function ThreeUpPoster({ t, start }) {
  const local = t - start;
  if (local < -0.3) return null;

  const items = [
    { label: 'CYBERSECURITY', n: '01' },
    { label: 'VOICE', n: '02' },
    { label: 'NETWORKING', n: '03' },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {items.map((it, i) => {
        const itemStart = i * 0.25;
        const entry = Easing.easeOutQuart(clamp((local - itemStart) / 0.9, 0, 1));
        const ty = (1 - entry) * 140;
        const op = entry;
        return (
          <div key={i} style={{
            position: 'absolute', left: 0, right: 0,
            top: 200 + i * 190,
            transform: `translateY(${ty}px)`,
            opacity: op,
            display: 'flex', alignItems: 'baseline',
            padding: '0 140px',
            borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none',
            paddingBottom: 30,
          }}>
            <div style={{
              fontFamily: FONT_M, fontSize: 22, letterSpacing: '0.35em',
              color: A.cyan, width: 80,
            }}>{it.n}</div>
            <div style={{
              fontFamily: FONT_H, fontWeight: 700, fontSize: 148,
              color: A.white, letterSpacing: '-0.035em', lineHeight: 1,
              flex: 1,
            }}>{it.label}</div>
            <div style={{
              fontFamily: FONT_M, fontSize: 18, letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase',
              textAlign: 'right',
            }}>
              {i === 0 && 'full-stack defense'}
              {i === 1 && 'hosted + teams'}
              {i === 2 && 'carrier · sase · fiber'}
            </div>
          </div>
        );
      })}

      {/* footer line */}
      <div style={{
        position: 'absolute', left: 140, bottom: 120, right: 140,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        opacity: Easing.easeOutCubic(clamp((local - 1.2) / 0.8, 0, 1)),
      }}>
        <div style={{
          fontFamily: FONT_M, fontSize: 20, letterSpacing: '0.3em',
          color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase',
        }}>
          one team · one bill · one point of accountability
        </div>
        <div style={{
          fontFamily: FONT_M, fontSize: 16, letterSpacing: '0.3em',
          color: A.cyan, textTransform: 'uppercase',
        }}>
          ASEVA.COM
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Scene2_Pillars });
