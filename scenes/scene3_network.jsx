// Scene 3 — The network. 40 → 65s (25s).
// An abstract fiber/node graph: dots form a coastline-ish cluster, lines
// connect them, packets travel along edges. Everything pulsing.

function Scene3_Network() {
  const { localTime, duration } = useSprite();
  const t = localTime;

  // Nodes — hand-placed to feel like a coastline + inland hubs, plus distant nodes.
  // coords are in 1920x1080 space.
  const nodes = React.useMemo(() => ([
    // primary cluster (coast-ish, left-of-center)
    { id: 'n1', x: 420, y: 540, r: 14, hub: true, label: 'CORE' },
    { id: 'n2', x: 540, y: 440, r: 8 },
    { id: 'n3', x: 620, y: 600, r: 10, hub: true },
    { id: 'n4', x: 360, y: 640, r: 7 },
    { id: 'n5', x: 480, y: 360, r: 8 },
    { id: 'n6', x: 700, y: 500, r: 9 },
    { id: 'n7', x: 310, y: 480, r: 7 },
    { id: 'n8', x: 560, y: 700, r: 8 },
    // reach nodes (right side)
    { id: 'r1', x: 1080, y: 320, r: 10, hub: true, label: 'REACH' },
    { id: 'r2', x: 1280, y: 460, r: 8 },
    { id: 'r3', x: 1480, y: 380, r: 8 },
    { id: 'r4', x: 1620, y: 560, r: 9, hub: true },
    { id: 'r5', x: 1380, y: 680, r: 7 },
    { id: 'r6', x: 1180, y: 720, r: 8 },
    { id: 'r7', x: 1540, y: 220, r: 6 },
    { id: 'r8', x: 1720, y: 400, r: 7 },
    // far
    { id: 'f1', x: 1820, y: 720, r: 6 },
    { id: 'f2', x: 240, y: 780, r: 6 },
    { id: 'f3', x: 180, y: 280, r: 6 },
  ]), []);

  const edges = React.useMemo(() => ([
    ['n1','n2'],['n1','n3'],['n1','n4'],['n1','n5'],['n1','n7'],
    ['n3','n6'],['n3','n8'],['n2','n5'],['n5','n6'],['n4','n8'],['n7','n3'],
    ['n6','r1'],['n6','r2'],['n3','r1'],
    ['r1','r2'],['r1','r3'],['r2','r4'],['r3','r4'],['r3','r7'],['r4','r8'],['r4','r5'],['r5','r6'],['r2','r6'],
    ['r4','f1'],['n4','f2'],['n7','f3'],
  ]), []);

  const nodeMap = React.useMemo(() => Object.fromEntries(nodes.map(n => [n.id, n])), [nodes]);

  // Reveal schedule:
  // 0-1.5s: title fades in
  // 0.5-5s: nodes pop in (staggered)
  // 1.5-6s: edges draw in
  // 3s+: packets travel
  // 10s+: headline swaps in
  // 18s+: stats appear

  return (
    <div style={{ position: 'absolute', inset: 0, background: A.navyDeep, overflow: 'hidden' }}>
      <GridBg color="rgba(0,161,226,0.05)" spacing={70} speed={3}/>

      {/* glow behind core hub */}
      <div style={{
        position: 'absolute', left: 420 - 250, top: 540 - 250,
        width: 500, height: 500, borderRadius: '50%',
        background: `radial-gradient(circle, ${A.cyan}22 0%, transparent 70%)`,
        opacity: clamp(t / 2, 0, 1),
      }}/>

      {/* SVG for edges and pulses */}
      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id="edge-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {edges.map(([a, b], i) => {
          const na = nodeMap[a], nb = nodeMap[b];
          const startT = 1.5 + i * 0.08;
          const p = Easing.easeOutQuart(clamp((t - startT) / 0.8, 0, 1));
          const len = Math.hypot(nb.x - na.x, nb.y - na.y);
          const dash = len;
          const offset = dash * (1 - p);
          return (
            <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              stroke={A.cyan} strokeWidth="1.2" strokeOpacity="0.35"
              strokeDasharray={dash} strokeDashoffset={offset}
              filter="url(#edge-glow)"
            />
          );
        })}

        {/* Packet travelers */}
        {edges.map(([a, b], i) => {
          if (t < 3) return null;
          const na = nodeMap[a], nb = nodeMap[b];
          // packet phase per edge
          const period = 3.5 + (i % 5) * 0.4;
          const phase = ((t - 3 + i * 0.25) % period) / period;
          if (phase > 0.8) return null;
          const p = phase / 0.8;
          const px = na.x + (nb.x - na.x) * p;
          const py = na.y + (nb.y - na.y) * p;
          return (
            <circle key={`p${i}`} cx={px} cy={py} r="3.5"
              fill={A.cyan} filter="url(#edge-glow)"
              opacity={0.9 * (1 - p * 0.3)}/>
          );
        })}

        {/* Nodes */}
        {nodes.map((n, i) => {
          const startT = 0.5 + i * 0.12;
          const p = Easing.easeOutBack(clamp((t - startT) / 0.6, 0, 1));
          const pulse = 1 + Math.sin(t * 2 + i) * 0.15;
          const r = n.r * p * (n.hub ? pulse : 1);
          return (
            <g key={n.id} opacity={p}>
              {n.hub && (
                <circle cx={n.x} cy={n.y} r={r * 3.5}
                  fill="none" stroke={A.cyan} strokeWidth="1" strokeOpacity="0.3"/>
              )}
              <circle cx={n.x} cy={n.y} r={r}
                fill={n.hub ? A.cyan : '#66c8ee'}
                filter="url(#edge-glow)"/>
              {n.hub && (
                <circle cx={n.x} cy={n.y} r={r * 1.8}
                  fill="none" stroke={A.cyan} strokeWidth="0.6" strokeOpacity="0.5"/>
              )}
            </g>
          );
        })}
      </svg>

      {/* Chapter label */}
      <div style={{
        position: 'absolute', left: 140, top: 120,
        opacity: clamp(t / 1.2, 0, 1),
      }}>
        <div style={{
          fontFamily: FONT_M, fontSize: 20, letterSpacing: '0.45em',
          color: A.cyan, textTransform: 'uppercase', marginBottom: 18,
        }}>
          // CHAPTER 02 / THE NETWORK
        </div>
      </div>

      {/* Morphing headline — first variant then swap */}
      <HeadlineSwap t={t}/>

      {/* Stats cluster appears at t=17 */}
      <StatsCluster t={t} start={17}/>

      <CornerMark/>
      <LiveBadge/>
    </div>
  );
}

function HeadlineSwap({ t }) {
  // 2 headlines, fade between.
  const h1 = 'we run our own';
  const h1b = 'network.';
  const h2 = 'every circuit,';
  const h2b = 'monitored.';

  // 2-11s: h1 visible; 11-17s: h2 visible
  const h1Op = clamp((t - 2)/0.8, 0, 1) * (1 - clamp((t - 10)/0.8, 0, 1));
  const h2Op = clamp((t - 11)/0.8, 0, 1) * (1 - clamp((t - 16.5)/0.6, 0, 1));

  return (
    <>
      <div style={{
        position: 'absolute', left: 140, top: 200,
        opacity: h1Op,
        transform: `translateX(${(1 - h1Op) * -40}px)`,
      }}>
        <div style={{
          fontFamily: FONT_H, fontWeight: 300, fontSize: 128,
          color: A.white, letterSpacing: '-0.035em', lineHeight: 0.95,
        }}>{h1}</div>
        <div style={{
          fontFamily: FONT_H, fontWeight: 700, fontSize: 152,
          color: A.cyan, letterSpacing: '-0.04em', lineHeight: 1,
          marginTop: -6,
        }}>{h1b}</div>
      </div>

      <div style={{
        position: 'absolute', left: 140, top: 200,
        opacity: h2Op,
        transform: `translateX(${(1 - h2Op) * 40}px)`,
      }}>
        <div style={{
          fontFamily: FONT_H, fontWeight: 300, fontSize: 128,
          color: A.white, letterSpacing: '-0.035em', lineHeight: 0.95,
        }}>{h2}</div>
        <div style={{
          fontFamily: FONT_H, fontWeight: 700, fontSize: 152,
          color: A.cyan, letterSpacing: '-0.04em', lineHeight: 1,
          marginTop: -6,
        }}>{h2b}</div>
      </div>
    </>
  );
}

function StatsCluster({ t, start }) {
  const local = t - start;
  if (local < -0.3) return null;

  const stats = [
    { label: 'FIBER OPERATED BY', value: 'ASEVA', size: 'big' },
    { label: 'CARRIER ROOTS SINCE', value: '1995' },
    { label: 'NETWORKS MONITORED', value: '24 / 7' },
  ];

  return (
    <div style={{
      position: 'absolute', left: 140, right: 140, bottom: 180,
      display: 'flex', gap: 60,
    }}>
      {stats.map((s, i) => {
        const entry = Easing.easeOutCubic(clamp((local - i * 0.2) / 0.8, 0, 1));
        return (
          <div key={i} style={{
            opacity: entry,
            transform: `translateY(${(1 - entry) * 30}px)`,
            flex: 1,
            borderTop: `2px solid ${A.cyan}`,
            paddingTop: 20,
          }}>
            <div style={{
              fontFamily: FONT_M, fontSize: 14, letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase',
              marginBottom: 12,
            }}>{s.label}</div>
            <div style={{
              fontFamily: FONT_H, fontWeight: 700,
              fontSize: s.size === 'big' ? 72 : 60,
              color: A.white, letterSpacing: '-0.02em', lineHeight: 1,
            }}>{s.value}</div>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { Scene3_Network });
