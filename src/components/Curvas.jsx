import { useRef } from 'react';
import { W, H, M, X, Y, QMAX, DESPLAZ_MAX, BASE, puntosDemanda, puntosOferta } from '../modelo';

const trazo = (pts) => 'M' + pts.map(([q, p]) => `${X(q)},${Y(p)}`).join('L');

export default function Curvas({ demanda, oferta, setSd, setSs }) {
  const arrastre = useRef(null);

  // Al presionar una curva, guarda dónde empezó el arrastre
  const iniciar = (valor, setter) => (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const ancho = e.currentTarget.ownerSVGElement.getBoundingClientRect().width;
    arrastre.current = { x: e.clientX, valor, setter, ancho };
  };

  // Al mover, convierte los píxeles de pantalla a unidades de cantidad (Q)
  const mover = (e) => {
    const a = arrastre.current;
    if (!a) return;
    const dq = ((e.clientX - a.x) / a.ancho) * (W / (W - M.l - M.r)) * QMAX;
    const nuevo = Math.round((a.valor + dq) * 2) / 2;
    a.setter(Math.min(DESPLAZ_MAX, Math.max(-DESPLAZ_MAX, nuevo)));
  };

  const terminar = () => { arrastre.current = null; };

  const agarre = { stroke: 'transparent', strokeWidth: 22, fill: 'none', cursor: 'ew-resize' };

  return (
    <g>
      <defs>
        <clipPath id="area">
          <path d={trazo(puntosDemanda(BASE))} stroke="var(--t-azul)" strokeWidth="2.5"
            strokeDasharray="7 6" opacity="0.4" fill="none" />
          <path d={trazo(puntosOferta(BASE))} stroke="var(--t-verde-osc)" strokeWidth="2.5"
            strokeDasharray="7 6" opacity="0.4" fill="none" />
          <rect x={M.l} y={M.t} width={W - M.l - M.r} height={H - M.t - M.b} />
        </clipPath>
      </defs>
      <g clipPath="url(#area)">
        <path d={trazo(puntosDemanda(demanda))} stroke="var(--t-azul)" strokeWidth="4"
          fill="none" strokeLinecap="round" />
        <path d={trazo(puntosOferta(oferta))} stroke="var(--t-verde-osc)" strokeWidth="4"
          fill="none" strokeLinecap="round" />

        {/* Líneas invisibles para arrastrar */}
        <path d={trazo(puntosDemanda(demanda))} {...agarre}
          onPointerDown={iniciar(demanda.sd, setSd)}
          onPointerMove={mover} onPointerUp={terminar} />
        <path d={trazo(puntosOferta(oferta))} {...agarre}
          onPointerDown={iniciar(oferta.ss, setSs)}
          onPointerMove={mover} onPointerUp={terminar} />
      </g>
      <text x={W - M.r - 6} y={M.t + 50} textAnchor="end" fontSize="14" fontWeight="700" fill="var(--t-azul)">Demanda</text>
      <text x={W - M.r - 6} y={M.t + 70} textAnchor="end" fontSize="14" fontWeight="700" fill="var(--t-verde-osc)">Oferta</text>
    </g>
  );
}