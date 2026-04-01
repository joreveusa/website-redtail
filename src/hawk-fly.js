/**
 * Redtail Hawk — Pixel Art Flying Animation
 * A pixel-art hawk soars across the screen on a gentle sine-wave path.
 */
(function () {
  'use strict';

  // ── Sprite config ────────────────────────────────────────────────────────
  const TILE = 5;   // canvas px per art pixel
  const COLS = 20;
  const ROWS = 12;
  const DISP = 2;   // display scale on main canvas (crisp pixel art)
  const SW   = COLS * TILE;
  const SH   = ROWS * TILE;
  const DW   = SW * DISP;   // 200px on screen
  const DH   = SH * DISP;   // 120px on screen

  // Color palette  (null = transparent)
  const _ = null;
  const S = '#1A0800'; // dark outline
  const W = '#7A4E2E'; // wing brown
  const w = '#9B6E4E'; // wing lighter
  const B = '#5A3010'; // body
  const b = '#A07850'; // head / light body
  const H = '#C09870'; // cheek highlight
  const T = '#CC4400'; // REDTAIL signature rust
  const t = '#FF6622'; // bright tail
  const E = '#FFB000'; // amber eye
  const K = '#D4B040'; // beak
  const C = '#F0ECD8'; // chest cream

  // ── Pixel frames (facing RIGHT) ─────────────────────────────────────────
  // Frame 0 — Wings UP
  const F0 = [
    [_,_,S,S,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,S,W,W,S,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [S,W,w,W,W,S,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [W,w,W,W,W,W,S,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,S,W,W,W,W,W,H,H,b,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,S,W,W,b,H,E,K,B,B,C,H,_,_,_,_,_,_],
    [_,_,_,_,_,_,b,b,B,B,B,B,B,b,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,b,B,B,T,T,T,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,t,T,T,T,t,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,T,T,t,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  ];

  // Frame 1 — Wings DOWN
  const F1 = [
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,H,b,b,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,H,E,K,B,B,C,H,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,b,b,B,B,B,B,b,_,_,_,_,_,_,_],
    [S,W,S,_,_,_,b,_,_,_,_,_,_,S,W,S,_,_,_,_],
    [W,W,W,S,_,_,_,_,_,_,_,_,S,W,W,_,_,_,_,_],
    [_,W,W,W,S,_,_,_,_,_,_,S,W,W,_,_,_,_,_,_],
    [_,_,S,W,W,S,_,_,_,_,S,W,S,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,b,B,T,T,T,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,t,T,T,T,t,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,T,T,t,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  ];

  // Frame 2 — Wings MID (glide)
  const F2 = [
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [S,W,W,S,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [W,w,W,W,W,W,S,_,H,b,b,_,_,_,_,_,_,_,_,_],
    [_,S,W,W,W,W,b,H,E,K,B,B,C,H,S,W,W,S,_,_],
    [_,_,_,_,_,b,b,B,B,B,B,B,b,W,W,W,W,S,_,_],
    [_,_,_,_,_,_,b,B,B,T,T,T,_,S,W,W,S,_,_,_],
    [_,_,_,_,_,_,t,T,T,T,t,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,T,T,t,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  ];

  const FRAMES = [F0, F1, F2, F1]; // cycle: up→down→glide→down

  // ── Pre-render sprites ───────────────────────────────────────────────────
  function bakeSprite(frameData, flipH) {
    const cv = document.createElement('canvas');
    cv.width = SW; cv.height = SH;
    const cx = cv.getContext('2d');
    cx.imageSmoothingEnabled = false;
    if (flipH) { cx.translate(SW, 0); cx.scale(-1, 1); }
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const col = frameData[r][c];
        if (col) { cx.fillStyle = col; cx.fillRect(c * TILE, r * TILE, TILE, TILE); }
      }
    }
    return cv;
  }

  const spritesR = FRAMES.map(f => bakeSprite(f, false));
  const spritesL = FRAMES.map(f => bakeSprite(f, true));

  // ── Overlay canvas ───────────────────────────────────────────────────────
  const canvas = document.createElement('canvas');
  canvas.id = 'hawk-fly-canvas';
  canvas.style.cssText =
    'position:fixed;top:0;left:0;width:100vw;height:100vh;' +
    'pointer-events:none;z-index:99990;' +
    'image-rendering:pixelated;image-rendering:crisp-edges;';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // ── Flight state ─────────────────────────────────────────────────────────
  const FLAP_MS = 150;
  const SPEED   = 0.20;    // px per ms
  const WAVE_A  = 50;      // vertical amplitude
  const WAVE_F  = 0.0020;  // wave frequency

  let hawkX, hawkY0, goRight, phase, fi, flapT, active = false;

  function launch() {
    active  = true;
    goRight = Math.random() > 0.5;
    hawkX   = goRight ? -(DW + 40) : window.innerWidth + 40;
    hawkY0  = window.innerHeight * (0.10 + Math.random() * 0.55);
    phase   = Math.random() * Math.PI * 2;
    fi      = 0;
    flapT   = 0;
  }

  function scheduleNext() {
    active = false;
    setTimeout(launch, 14000 + Math.random() * 22000);
  }

  // First appearance after 4-7 s
  setTimeout(launch, 4000 + Math.random() * 3000);

  // ── Render loop ──────────────────────────────────────────────────────────
  let prev = null;

  function tick(now) {
    requestAnimationFrame(tick);
    if (!prev) { prev = now; return; }
    const dt = Math.min(now - prev, 50);
    prev = now;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!active) return;

    // Move
    hawkX  += (goRight ? 1 : -1) * SPEED * dt;
    phase  += WAVE_F * dt;
    const y = hawkY0 + Math.sin(phase) * WAVE_A;

    // Wing flap
    flapT += dt;
    if (flapT >= FLAP_MS) { fi = (fi + 1) % spritesR.length; flapT = 0; }

    // Shadow
    ctx.save();
    ctx.globalAlpha = 0.07;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(hawkX + DW / 2, canvas.height - 18, DW * 0.42, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Sprite
    const sprites = goRight ? spritesR : spritesL;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(sprites[fi], Math.round(hawkX), Math.round(y), DW, DH);

    // Exit
    if ((goRight && hawkX > canvas.width + 40) ||
        (!goRight && hawkX < -(DW * 2 + 40))) {
      scheduleNext();
    }
  }

  requestAnimationFrame(tick);
})();
