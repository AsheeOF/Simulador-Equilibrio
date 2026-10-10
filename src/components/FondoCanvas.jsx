import { useEffect, useRef } from 'react';


// Partículas y líneas: la paleta de la UV en modo claro, tonos más claros en modo oscuro
const PALETA = {
  light: { azul: '0, 91, 172', verde: '0, 169, 79', k: 1 },
  dark: { azul: '91, 168, 240', verde: '52, 208, 122', k: 1.3 },
};

const azar = (a, b) => a + Math.random() * (b - a);

export default function FondoCanvas({ tema = 'light' }) {
  const ref = useRef(null);
  const temaRef = useRef(tema);
  const redibujar = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0, h = 0, dpr = 1, raf = null, parts = [], logos = [];
    const ondas = [];
    const mouse = { x: -9999, y: -9999, px: 0, py: 0 }; // px, py: -1..1 desde el centro

    const logo = new Image();
    logo.src = `${import.meta.env.BASE_URL}logo-fondo.png`;

    const crear = () => {
      const movil = w < 700;
      const n = Math.min(80, Math.round((w * h) / (movil ? 16000 : 15000)));
      parts = Array.from({ length: n }, () => ({
        x: azar(0, w), y: azar(0, h),
        vx: azar(-0.25, 0.25), vy: azar(-0.25, 0.25),
        r: azar(1.4, 3), c: Math.random() < 0.7 ? 'azul' : 'verde',
      }));
      const cant = movil ? 3 : 6;
      logos = Array.from({ length: cant }, (_, i) => ({
        x: azar(0, w), y: azar(0, h),
        vx: azar(-0.12, 0.12), vy: azar(-0.1, 0.1),
        ancho: i === 0 ? 420 : azar(90, 240), rot: azar(-0.4, 0.4),
        vrot: azar(-0.0015, 0.0015), prof: azar(10, 40), alfa: i === 0 ? 0.06 : 0.09,
      }));
    };

    const ajustar = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      crear();
    };

    const dibujar = (mover) => {
      const pal = PALETA[temaRef.current] ?? PALETA.light;
      ctx.clearRect(0, 0, w, h);

      // Logotipos 
      if (logo.complete && logo.naturalWidth) {
        const prop = logo.naturalHeight / logo.naturalWidth;
        for (const l of logos) {
          if (mover) {
            l.x += l.vx; l.y += l.vy; l.rot += l.vrot;
            const m = l.ancho;
            if (l.x < -m) l.x = w + m; else if (l.x > w + m) l.x = -m;
            if (l.y < -m) l.y = h + m; else if (l.y > h + m) l.y = -m;
          }
          ctx.save();
          ctx.globalAlpha = Math.min(1, l.alfa * pal.k);
          ctx.translate(l.x - mouse.px * l.prof, l.y - mouse.py * l.prof);
          ctx.rotate(l.rot);
          ctx.drawImage(logo, -l.ancho / 2, -(l.ancho * prop) / 2, l.ancho, l.ancho * prop);
          ctx.restore();
        }
      }

      // Partículas
      for (const p of parts) {
        if (mover) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 150 * 150 && d2 > 1) {
            const d = Math.sqrt(d2), f = (150 - d) / 150;
            p.vx += (dx / d) * f * 0.06;
            p.vy += (dy / d) * f * 0.06;
          }
          p.vx *= 0.985; p.vy *= 0.985; // fricción
          // velocidad mínima para que nunca se queden quietas
          if (Math.hypot(p.vx, p.vy) < 0.08) { p.vx += azar(-0.02, 0.02); p.vy += azar(-0.02, 0.02); }
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0) p.x = w; else if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h; else if (p.y > h) p.y = 0;
        }
      }

      // Líneas entre partículas cercanas
      ctx.lineWidth = 1;
      for (let i = 0; i < parts.length; i++) {
        const a = parts[i];
        for (let j = i + 1; j < parts.length; j++) {
          const b = parts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 120) {
            ctx.strokeStyle = `rgba(${pal.azul}, ${(1 - d / 120) * 0.22})`;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        // enlace con el cursor
        const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (dm < 170) {
          ctx.strokeStyle = `rgba(${pal.verde}, ${(1 - dm / 170) * 0.5})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }

      for (const p of parts) {
        ctx.fillStyle = `rgba(${pal[p.c]}, 0.45)`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }

      // Ondas de clic
      for (let i = ondas.length - 1; i >= 0; i--) {
        const o = ondas[i];
        if (mover) o.r += 4;
        const a = 1 - o.r / 220;
        if (a <= 0) { ondas.splice(i, 1); continue; }
        ctx.strokeStyle = `rgba(${pal.azul}, ${a * 0.45})`;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2); ctx.stroke();
      }
    };

    const ciclo = () => { dibujar(true); raf = requestAnimationFrame(ciclo); };

    const alMover = (e) => {
      mouse.x = e.clientX; mouse.y = e.clientY;
      mouse.px = (e.clientX / w - 0.5) * 2; mouse.py = (e.clientY / h - 0.5) * 2;
    };
    const alSalir = () => { mouse.x = -9999; mouse.y = -9999; };
    const alClic = (e) => { ondas.push({ x: e.clientX, y: e.clientY, r: 0 }); };
    const alVisibilidad = () => {
      if (reducir) return;
      if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
      else if (!raf) raf = requestAnimationFrame(ciclo);
    };

    redibujar.current = () => { if (reducir) dibujar(false); };
    ajustar();
    window.addEventListener('resize', ajustar);
    if (reducir) {
      // sin movimiento: un solo cuadro estático cuando cargue el logo
      logo.onload = () => dibujar(false);
      dibujar(false);
    } else {
      window.addEventListener('pointermove', alMover);
      window.addEventListener('pointerdown', alClic);
      document.addEventListener('pointerleave', alSalir);
      document.addEventListener('visibilitychange', alVisibilidad);
      raf = requestAnimationFrame(ciclo);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', ajustar);
      window.removeEventListener('pointermove', alMover);
      window.removeEventListener('pointerdown', alClic);
      document.removeEventListener('pointerleave', alSalir);
      document.removeEventListener('visibilitychange', alVisibilidad);
    };
  }, []);

  useEffect(() => {
    temaRef.current = tema;
    redibujar.current?.();
  }, [tema]);

  return <canvas ref={ref} className="fondo-canvas" aria-hidden="true" />;
}
