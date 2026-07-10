(() => {
  const canvas = document.getElementById("scene");
  if (!canvas) return;

  // desynchronized helps avoid main-thread blocking on some GPUs
  const ctx =
    canvas.getContext("2d", { alpha: false, desynchronized: true, willReadFrequently: false }) ||
    canvas.getContext("2d", { alpha: false });

  let w = 0;
  let h = 0;
  let dpr = 1;
  let nodes = [];
  let particles = [];
  let running = true;
  let raf = 0;
  let last = performance.now();
  let mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  let linkDist = 140;
  let linkDist2 = linkDist * linkDist;
  let influence = 200;
  let influence2 = influence * influence;

  // static backdrop (redraw only on resize)
  const bg = document.createElement("canvas");
  const bgCtx = bg.getContext("2d", { alpha: false });

  function rand(a, b) {
    return a + Math.random() * (b - a);
  }

  function resize() {
    // Cap DPR hard — biggest FPS win on retina
    dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    w = window.innerWidth;
    h = window.innerHeight;

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    bg.width = canvas.width;
    bg.height = canvas.height;
    bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintBg();

    linkDist = Math.min(160, Math.max(100, w * 0.12));
    linkDist2 = linkDist * linkDist;
    influence = 200;
    influence2 = influence * influence;

    seed();
  }

  function paintBg() {
    const g = bgCtx.createRadialGradient(
      w * 0.5,
      h * 0.32,
      0,
      w * 0.5,
      h * 0.5,
      Math.max(w, h) * 0.8
    );
    g.addColorStop(0, "#101a2e");
    g.addColorStop(0.45, "#080e1a");
    g.addColorStop(1, "#03050a");
    bgCtx.fillStyle = g;
    bgCtx.fillRect(0, 0, w, h);

    const orb = (x, y, r, c) => {
      const og = bgCtx.createRadialGradient(x, y, 0, x, y, r);
      og.addColorStop(0, c);
      og.addColorStop(1, "rgba(0,0,0,0)");
      bgCtx.fillStyle = og;
      bgCtx.beginPath();
      bgCtx.arc(x, y, r, 0, Math.PI * 2);
      bgCtx.fill();
    };

    orb(w * 0.3, h * 0.28, Math.max(w, h) * 0.36, "rgba(61,224,255,0.13)");
    orb(w * 0.72, h * 0.55, Math.max(w, h) * 0.4, "rgba(80,130,255,0.11)");
  }

  function seed() {
    // Fewer nodes = much smoother (O(n²) links)
    const count = Math.max(18, Math.min(32, ((w * h) / 45000) | 0));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: rand(-0.18, 0.18),
      vy: rand(-0.14, 0.14),
      r: rand(1.5, 2.6),
    }));

    const pCount = Math.max(24, Math.min(48, (w / 28) | 0));
    particles = Array.from({ length: pCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: rand(0.6, 1.5),
      vx: rand(-0.2, 0.2),
      vy: rand(-0.28, -0.04),
      a: rand(0.3, 0.6),
    }));
  }

  function frame(ts) {
    if (!running) return;

    // clamp dt so tab-return doesn't explode physics
    const dt = Math.min(32, ts - last) / 16.67;
    last = ts;

    mouse.x += (mouse.tx - mouse.x) * 0.14;
    mouse.y += (mouse.ty - mouse.y) * 0.14;
    const mx = mouse.x * w;
    const my = mouse.y * h;

    // 1) blit static background (no gradient rebuild)
    ctx.drawImage(bg, 0, 0, w, h);

    // 2) cursor glow — one gradient only
    const glow = ctx.createRadialGradient(mx, my, 0, mx, my, 180);
    glow.addColorStop(0, "rgba(61,224,255,0.16)");
    glow.addColorStop(0.4, "rgba(91,140,255,0.06)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(mx - 180, my - 180, 360, 360);

    ctx.strokeStyle = "rgba(61,224,255,0.35)";
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.arc(mx, my, 20, 0, Math.PI * 2);
    ctx.stroke();

    // 3) update + links in one pass (squared distance, no sqrt)
    const nLen = nodes.length;
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (let i = 0; i < nLen; i++) {
      const a = nodes[i];

      const mdx = mx - a.x;
      const mdy = my - a.y;
      const md2 = mdx * mdx + mdy * mdy;
      if (md2 < influence2 && md2 > 0.01) {
        const inv = 1 / Math.sqrt(md2);
        const force = (1 - md2 / influence2) * 0.03 * dt;
        a.vx += mdx * inv * force;
        a.vy += mdy * inv * force;
      }

      // only check a few neighbors ahead — caps link cost
      const maxJ = Math.min(nLen, i + 8);
      for (let j = i + 1; j < maxJ; j++) {
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > linkDist2 || d2 < 1) continue;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
      }

      if (md2 < linkDist2 * 1.6) {
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(mx, my);
      }
    }

    ctx.strokeStyle = "rgba(90,220,255,0.28)";
    ctx.stroke();

    // 4) nodes — single path batch
    ctx.fillStyle = "rgba(190,245,255,0.9)";
    ctx.beginPath();
    for (let i = 0; i < nLen; i++) {
      const n = nodes[i];
      n.vx *= 0.985;
      n.vy *= 0.985;
      n.x += n.vx * dt;
      n.y += n.vy * dt;

      if (n.x < 0) {
        n.x = 0;
        n.vx *= -1;
      } else if (n.x > w) {
        n.x = w;
        n.vx *= -1;
      }
      if (n.y < 0) {
        n.y = 0;
        n.vy *= -1;
      } else if (n.y > h) {
        n.y = h;
        n.vy *= -1;
      }

      ctx.moveTo(n.x + n.r, n.y);
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    }
    ctx.fill();

    // soft rings only near cursor (cheap)
    ctx.strokeStyle = "rgba(61,224,255,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < nLen; i++) {
      const n = nodes[i];
      const dx = n.x - mx;
      const dy = n.y - my;
      if (dx * dx + dy * dy > influence2) continue;
      ctx.moveTo(n.x + n.r * 3, n.y);
      ctx.arc(n.x, n.y, n.r * 3, 0, Math.PI * 2);
    }
    ctx.stroke();

    // 5) particles — batched, light mouse pull
    ctx.fillStyle = "rgba(210,240,255,0.45)";
    ctx.beginPath();
    const pLen = particles.length;
    const pullR2 = 160 * 160;
    for (let i = 0; i < pLen; i++) {
      const p = particles[i];
      const dx = mx - p.x;
      const dy = my - p.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < pullR2 && d2 > 1) {
        const inv = 1 / Math.sqrt(d2);
        p.vx += dx * inv * 0.015 * dt;
        p.vy += dy * inv * 0.015 * dt;
      }

      p.vx *= 0.99;
      p.vy *= 0.99;
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      if (p.y < -8) {
        p.y = h + 8;
        p.x = Math.random() * w;
      } else if (p.y > h + 8) p.y = -8;
      if (p.x < -8) p.x = w + 8;
      else if (p.x > w + 8) p.x = -8;

      ctx.moveTo(p.x + p.r, p.y);
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    }
    ctx.fill();

    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });

  window.addEventListener(
    "pointermove",
    (e) => {
      mouse.tx = e.clientX / Math.max(1, w);
      mouse.ty = e.clientY / Math.max(1, h);
    },
    { passive: true }
  );

  window.addEventListener("resize", () => {
    clearTimeout(resize._t);
    resize._t = setTimeout(resize, 150);
  });

  resize();
  running = true;
  raf = requestAnimationFrame(frame);
})();
