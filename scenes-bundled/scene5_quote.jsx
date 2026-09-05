// Scene 5 — The pull quote. 90 → 115s (25s).
// "An extension of your IT team." Big editorial typography with minimal flourish.

function Scene5_Quote() {
  const { localTime } = useSprite();
  const t = localTime;

  // 0-1.5s: quote marks fade in
  // 0.5-6: line 1 reveal word-by-word
  // 3-9: line 2
  // 9-14: attribution block
  // 14-22: headline replacement
  // 22-25: outgoing

  const exitT = clamp((t - 22.5) / 2, 0, 1);
  const rootOp = 1 - exitT;

  return (
    <div style={{ position: 'absolute', inset: 0, background: A.paperWarm, overflow: 'hidden', opacity: rootOp }}>
      {/* faint cyan rules */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 260, height: 1,
        background: 'rgba(5,26,53,0.08)',
      }}/>
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 260, height: 1,
        background: 'rgba(5,26,53,0.08)',
      }}/>

      {/* giant cyan quote mark in the background */}
      <div style={{
        position: 'absolute', left: 80, top: -120,
        fontFamily: 'Georgia, serif',
        fontSize: 900, fontWeight: 700, lineHeight: 1,
        color: A.cyan, opacity: 0.1 * clamp(t / 1.2, 0, 1),
      }}>
        “
      </div>

      {/* chapter */}
      <div style={{
        position: 'absolute', left: 140, top: 120,
        fontFamily: FONT_M, fontSize: 20, letterSpacing: '0.45em',
        color: A.cyan, textTransform: 'uppercase',
        opacity: clamp(t / 1, 0, 1),
      }}>
        // CHAPTER 04 / WHAT CUSTOMERS SAY
      </div>

      {/* The quote */}
      <div style={{
        position: 'absolute', left: 140, right: 140, top: 280,
      }}>
        <BigQuote t={t}/>
      </div>

      {/* Swap headline: after ~14s, the quote fades, a new headline arrives */}
      <SwapHeadline t={t}/>

      {/* Attribution row — full block while quote is up, hidden when swap arrives */}
      <div style={{
        position: 'absolute', left: 140, right: 140, bottom: 140,
        opacity: clamp((t - 9) / 1.2, 0, 1) * (1 - clamp((t - 13) / 1, 0, 1)),
        transform: `translateY(${(1 - clamp((t - 9)/1.2, 0, 1)) * 30}px)`,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{
            fontFamily: FONT_M, fontSize: 14, letterSpacing: '0.3em',
            color: A.muted, textTransform: 'uppercase', marginBottom: 10,
          }}>Customers say, verbatim</div>
          <div style={{
            fontFamily: FONT_H, fontWeight: 600, fontSize: 36,
            color: A.navy, letterSpacing: '-0.01em',
          }}>— every IT director we've worked with.</div>
        </div>
        <div style={{
          fontFamily: FONT_M, fontSize: 14, letterSpacing: '0.3em',
          color: A.cyan, textTransform: 'uppercase',
        }}>NOT A VENDOR. A TEAMMATE.</div>
      </div>
    </div>
  );
}

function BigQuote({ t }) {
  // Line 1: "An extension"
  // Line 2: "of your IT team."
  const w1 = 'an extension';
  const w2 = 'of your IT team.';

  const reveal1T = clamp((t - 0.6) / 2.4, 0, 1);
  const reveal2T = clamp((t - 3.0) / 2.8, 0, 1);

  // Fade out when the swap headline arrives
  const fadeOut = clamp((t - 13) / 1, 0, 1);
  const op = 1 - fadeOut;

  return (
    <div style={{ opacity: op, transform: `translateY(${fadeOut * -30}px)` }}>
      <RevealLine text={w1} progress={reveal1T} size={180} color={A.navy} weight={300}/>
      <RevealLine text={w2} progress={reveal2T} size={200} color={A.cyan} weight={700} marginTop={12}/>
    </div>
  );
}

function RevealLine({ text, progress, size, color, weight, marginTop = 0 }) {
  const chars = Array.from(text);
  return (
    <div style={{
      fontFamily: FONT_H, fontWeight: weight, fontSize: size,
      color, letterSpacing: '-0.035em', lineHeight: 1,
      marginTop,
    }}>
      {chars.map((c, i) => {
        const cp = clamp(progress * chars.length - i, 0, 1);
        const eased = Easing.easeOutCubic(cp);
        return (
          <span key={i} style={{
            display: 'inline-block',
            opacity: eased,
            transform: `translateY(${(1 - eased) * 40}px)`,
            whiteSpace: 'pre',
          }}>{c}</span>
        );
      })}
    </div>
  );
}

function SwapHeadline({ t }) {
  const local = t - 14;
  if (local < 0) return null;
  const p = clamp(local / 1.2, 0, 1);
  const fadeOut = clamp((local - 7) / 1, 0, 1);
  const op = Easing.easeOutCubic(p) * (1 - fadeOut);

  return (
    <div style={{
      position: 'absolute', left: 140, right: 140, top: 280,
      opacity: op,
      transform: `translateY(${(1 - Easing.easeOutCubic(p)) * 30}px)`,
    }}>
      <div style={{
        fontFamily: FONT_H, fontWeight: 300, fontSize: 120,
        color: A.navy, letterSpacing: '-0.035em', lineHeight: 1.02,
      }}>
        The average Aseva customer
      </div>
      <div style={{
        fontFamily: FONT_H, fontWeight: 700, fontSize: 200,
        color: A.navy, letterSpacing: '-0.04em', lineHeight: 1,
        marginTop: 18,
      }}>
        stays a <span style={{ color: A.cyan }}>decade</span>.
      </div>
      <div style={{
        fontFamily: FONT_M, fontSize: 22, letterSpacing: '0.3em',
        color: A.muted, textTransform: 'uppercase', marginTop: 40,
      }}>
        Many have stayed two.
      </div>
    </div>
  );
}

Object.assign(window, { Scene5_Quote });
