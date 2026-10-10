import { W, H, M, X, Y } from '../modelo';

const ticksQ = [0, 20, 40, 60, 80, 100, 120, 140];
const ticksP = [0, 20, 40, 60, 80, 100, 120, 140];

export default function Plano({ children }) {
  return (
    <svg className="plano" viewBox={`0 0 ${W} ${H}`} role="img"
         aria-label="Gráfica de oferta y demanda con el punto de equilibrio">
      {/* Cuadrícula y números del eje Q (horizontal) */}
      {ticksQ.map((q) => (
        <g key={'q' + q}>
          <line x1={X(q)} x2={X(q)} y1={M.t} y2={Y(0)} stroke="var(--t-rejilla)" />
          <text x={X(q)} y={Y(0) + 18} textAnchor="middle" fontSize="12" fill="var(--t-gris)">{q}</text>
        </g>
      ))}

      {/* Cuadrícula y números del eje P (vertical) */}
      {ticksP.map((p) => (
        <g key={'p' + p}>
          <line x1={M.l} x2={W - M.r} y1={Y(p)} y2={Y(p)} stroke="var(--t-rejilla)" />
          <text x={M.l - 8} y={Y(p) + 4} textAnchor="end" fontSize="12" fill="var(--t-gris)">{p}</text>
        </g>
      ))}

      {/* Los dos ejes */}
      <line x1={M.l} x2={W - M.r} y1={Y(0)} y2={Y(0)} stroke="var(--t-texto)" strokeWidth="2" />
      <line x1={M.l} x2={M.l} y1={M.t} y2={Y(0)} stroke="var(--t-texto)" strokeWidth="2" />

      {/* Títulos de los ejes */}
      <text x={(M.l + W - M.r) / 2} y={H - 12} textAnchor="middle" fontSize="14" fontWeight="600">
        Cantidad (Q)
      </text>
      <text
        transform={`translate(18 ${(M.t + H - M.b) / 2}) rotate(-90)`}
        textAnchor="middle" fontSize="14" fontWeight="600"
      >
        Precio (P)
      </text>

      {/* Aquí irán las curvas y el equilibrio en los siguientes pasos */}
      {children}
    </svg>
  );
}