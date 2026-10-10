import { M, X, Y } from '../modelo';

export default function Equilibrio({ q, p, base }) {
  const halo = { paintOrder: 'stroke', stroke: 'var(--t-superficie)', strokeWidth: 4 };
  const cambio = Math.abs(base.q - q) > 0.2 || Math.abs(base.p - p) > 0.2;
  return (
    <g>
      <defs>
        <marker id="flecha-eq" viewBox="0 0 10 10" refX="8" refY="5"
                markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 Z" fill="var(--t-gris)" />
        </marker>
      </defs>

      {/* Equilibrio de referencia y flecha de cómo se movió, solo si ya cambió algo */}
      {cambio && (
        <g>
          <line className="trayecto" x1={X(base.q)} y1={Y(base.p)} x2={X(q)} y2={Y(p)}
                stroke="var(--t-gris)" strokeWidth="2" strokeDasharray="5 4"
                markerEnd="url(#flecha-eq)" />
          <circle cx={X(base.q)} cy={Y(base.p)} r="6" fill="none"
                  stroke="var(--t-gris)" strokeWidth="2" strokeDasharray="3 3" />
          <text x={X(base.q) + 10} y={Y(base.p) + 18} fontSize="12" fill="var(--t-gris)"
                style={halo}>Equilibrio base</text>
        </g>
      )}

      <line x1={X(q)} x2={X(q)} y1={Y(p)} y2={Y(0)}
            stroke="var(--t-texto)" strokeWidth="1.5" strokeDasharray="6 5" />
      <line x1={M.l} x2={X(q)} y1={Y(p)} y2={Y(p)}
            stroke="var(--t-texto)" strokeWidth="1.5" strokeDasharray="6 5" />

      {/* Anillo que pulsa para llamar la atención sobre el equilibrio */}
      <circle className="pulso" cx={X(q)} cy={Y(p)} r="8" fill="none"
              stroke="var(--t-azul)" strokeWidth="3" />
      <circle cx={X(q)} cy={Y(p)} r="8" fill="var(--t-texto)"
              stroke="var(--t-superficie)" strokeWidth="2.5" />
      <text x={X(q)} y={Y(0) - 8} textAnchor="middle" fontSize="13"
            fontWeight="700" style={halo}>Q* = {q.toFixed(1)}</text>
      <text x={M.l + 8} y={Y(p) - 8} fontSize="13"
            fontWeight="700" style={halo}>P* = {p.toFixed(1)}</text>
    </g>
  );
}
