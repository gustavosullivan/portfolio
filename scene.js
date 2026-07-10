(() => {
  const canvas = document.getElementById("scene");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: false });

  let w = 0;
  let h = 0;
  let dpr = 1;
  let nodes = [];
  let particles = [];
  let t0 = performance.now();
  let mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  let cursorGlow = 0.55;

  function rand(a, b) {
    return a + Math.random() * (b - a);
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function seed() {
    const count = Math.max(36, Math.min(70, ((w * h) / 22000) | 0));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: rand(-0.22, 0.22),
      vy: rand(-0.18, 0.18),
      r: rand(1.4, 2.8),
      phase: Math.random() * Math.PI * 2,
    }));

    particles = Array.from({ length: Math.max(55, Math.min(120, (w / 11) | 0)) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: rand(0.5, 1.6),
      vx: rand(-0.3, 0.3),
      vy: rand(-0.4, -0.05),
      a: rand(0.25, 0.65),
    }));
  }

  function drawBackground(t) {
    const g = ctx.createRadialGradient(
      w * 0.5,
      h * 0.32,
      0,
      w * 0.5,
      h * 0.5,
      Math.max(w, h) * 0.8
    );
    g.addColorStop(0, "#101a2e");
    g.addColorStop(0.4, "#080e1a");
    g.addColorStop(1, "#03050a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    const orb = (x, y, r, rgbaCore) => {
      const og = ctx.createRadialGradient(x, y, 0, x, y, r);
      og.addColorStop(0, rgbaCore);
      og.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = og;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };

    orb(
      w * 0.28 + Math.sin(t * 0.2) * 40,
      h * 0.28,
      Math.max(w, h) * 0.38,
      "rgba(61,224,255,0.14)"
    );
    orb(
      w * 0.74 + Math.cos(t * 0.15) * 45,
      h * 0.52,
      Math.max(w, h) * 0.42,
      "rgba(80,130,255,0.12)"
    );
  }

  function drawCursorField(mx, my) {
    const g = ctx.createRadialGradient(mx, my, 0, mx, my, 220);
    g.addColorStop(0, `rgba(61, 224, 255, ${0.2 * cursorGlow})`);
    g.addColorStop(0.35, `rgba(91, 140, 255, ${0.09 * cursorGlow})`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(mx, my, 220, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = `rgba(61, 224, 255, ${0.4 * cursorGlow})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(mx, my, 22, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = `rgba(200, 240, 255, ${0.22 * cursorGlow})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(mx, my, 40, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawNetwork(t) {
    const mx = mouse.x * w;
    const my = mouse.y * h;
    const linkDist = Math.min(210, Math.max(130, w * 0.16));
    const influence = 260;

    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];

      const mdx = mx - a.x;
      const mdy = my - a.y;
      const md = Math.sqrt(mdx * mdx + mdy * mdy) || 1;
      if (md < influence) {
        const force = (1 - md / influence) * 0.035;
        a.vx += (mdx / md) * force;
        a.vy += (mdy / md) * force;
      }

      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d > linkDist) continue;
        const alpha = (1 - d / linkDist) * 0.45;
        ctx.strokeStyle = `rgba(90, 220, 255, ${alpha})`;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      if (md < linkDist * 1.35) {
        const aLink = (1 - md / (linkDist * 1.35)) * 0.7;
        ctx.strokeStyle = `rgba(120, 230, 255, ${aLink})`;
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(mx, my);
        ctx.stroke();
      }
    }

    for (const n of nodes) {
      n.vx *= 0.98;
      n.vy *= 0.98;
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 0 || n.x > w) {
        n.vx *= -1;
        n.x = Math.max(0, Math.min(w, n.x));
      }
      if (n.y < 0 || n.y > h) {
        n.vy *= -1;
        n.y = Math.max(0, Math.min(h, n.y));
      }

      n.vx += rand(-0.01, 0.01);
      n.vy += rand(-0.01, 0.01);

      const mdx = n.x - mx;
      const mdy = n.y - my;
      const md = Math.sqrt(mdx * mdx + mdy * mdy);
      const near = Math.max(0, 1 - md / influence);
      const pulse = 0.7 + 0.3 * Math.sin(t * 2.2 + n.phase);
      const glow = pulse * (0.7 + near * 1.1);

      ctx.fillStyle = `rgba(180, 245, 255, ${0.85 * glow})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * (1 + near * 0.6), 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = `rgba(61, 224, 255, ${0.35 * glow})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * (3.2 + near * 2), 0, Math.PI * 2);
      ctx.stroke();

      if (near > 0.35) {
        const halo = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 28);
        halo.addColorStop(0, `rgba(61,224,255,${0.35 * near})`);
        halo.addColorStop(1, "rgba(61,224,255,0)");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 28, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function drawParticles(mx, my) {
    for (const p of particles) {
      const dx = mx - p.x;
      const dy = my - p.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      if (d < 180) {
        p.vx += (dx / d) * 0.02;
        p.vy += (dy / d) * 0.02;
      }

      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.99;
      p.vy *= 0.99;

      if (p.y < -10) {
        p.y = h + 10;
        p.x = Math.random() * w;
      }
      if (p.y > h + 10) p.y = -10;
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;

      ctx.fillStyle = `rgba(210, 240, 255, ${p.a})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawScan(t) {
    const y = ((t * 55) % (h + 100)) - 50;
    const g = ctx.createLinearGradient(0, y - 50, 0, y + 50);
    g.addColorStop(0, "rgba(61,224,255,0)");
    g.addColorStop(0.5, "rgba(61,224,255,0.07)");
    g.addColorStop(1, "rgba(61,224,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, y - 50, w, 100);
  }

  function frame(ts) {
    const t = (ts - t0) * 0.001;
    mouse.x += (mouse.tx - mouse.x) * 0.12;
    mouse.y += (mouse.ty - mouse.y) * 0.12;

    const mx = mouse.x * w;
    const my = mouse.y * h;

    drawBackground(t);
    drawCursorField(mx, my);
    drawNetwork(t);
    drawParticles(mx, my);
    drawScan(t);

    requestAnimationFrame(frame);
  }

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
    resize._t = setTimeout(resize, 120);
  });

  resize();
  requestAnimationFrame(frame);
})();
