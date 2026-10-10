import { M, W, QMAX, X, Y } from '../modelo';

export default function Desequilibrio({ precio, qd, qs, enEquilibrio, diferencia }) {
  const color = enEquilibrio ? 'var(--t-gris)' : 'var(--t-azul-osc)';
  const puntos = [
    { nombre: 'Qd', q: qd, color: 'var(--t-azul)' },
    { nombre: 'Qs', q: qs, color: 'var(--t-verde-osc)' },
  ];
  const y = Y(precio);
  const sube = diferencia < 0; // precio bajo el equilibrio: presión al alza
  const xFlecha = M.l + (W - M.l - M.r) * 0.62; // lejos de la leyenda del borde derecho

  return (
    <g>
      {/* Línea horizontal del precio de mercado */}
      <line x1={M.l} x2={W - M.r} y1={y} y2={y}
            stroke={color} strokeWidth="1.5" strokeDasharray="2 5" />

      {/* Barra que resalta la brecha entre Qd y Qs (se recorta al borde de la gráfica) */}
      {!enEquilibrio && (
        <line className="brecha" x1={X(Math.min(qd, QMAX))} x2={X(Math.min(qs, QMAX))} y1={y} y2={y}
              stroke="var(--t-azul-osc)" strokeWidth="9" opacity="0.45" />
      )}

      {/* Marcas donde el precio toca cada curva */}
      {!enEquilibrio && puntos.map((pt) => {
        const fuera = pt.q > QMAX;
        const x = X(Math.min(pt.q, QMAX));
        const arriba = y - 12 > M.t + 8; // si la línea está pegada al borde superior, la etiqueta va abajo
        const ancla = fuera ? 'end' : pt.q <= 0 ? 'start' : 'middle';
        return (
          <g key={pt.nombre}>
            <circle cx={x} cy={y} r="6" fill={pt.color}
                    stroke="var(--t-superficie)" strokeWidth="2" />
            <text x={x} y={arriba ? y - 12 : y + 22} textAnchor={ancla}
                  fontSize="13" fontWeight="700" fill={pt.color}>
              {fuera ? `${pt.nombre} = ${pt.q.toFixed(0)} →` : pt.nombre}
            </text>
          </g>
        );
      })}

      {/* Flecha animada que sale de la línea de precio hacia donde empuja el mercado */}
      {!enEquilibrio && (
        <g transform={`translate(${xFlecha} ${y})`}>
          <g className={sube ? 'empuje empuje--sube' : 'empuje empuje--baja'}>
            <path d={sube ? 'M0 -26 L-9 -14 L9 -14 Z' : 'M0 26 L-9 14 L9 14 Z'} fill="var(--t-azul-osc)" />
            <path d={sube ? 'M0 -14 L0 -2' : 'M0 14 L0 2'} stroke="var(--t-azul-osc)" strokeWidth="3" />
          </g>
          <text x="16" y={sube ? -12 : 20} fontSize="12" fontWeight="700" fill="var(--t-azul-osc)"
                style={{ paintOrder: 'stroke', stroke: 'var(--t-superficie)', strokeWidth: 3 }}>
            {sube ? 'el precio sube' : 'el precio baja'}
          </text>
        </g>
      )}
    </g>
  );
}
