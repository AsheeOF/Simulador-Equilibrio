import { M, X, Y, PD0, PS0, PMAX } from '../modelo';

function Marca({ x, y, n }) {
  return (
    <g>
      <circle cx={x} cy={y} r="11" fill="var(--t-azul-osc)" stroke="var(--t-superficie)" strokeWidth="2" />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--t-superficie)">{n}</text>
    </g>
  );
}

const dentro = (p) => Math.min(PMAX - 8, Math.max(8, p));

export default function Anotaciones({ demanda, oferta, eq }) {
  const pd = dentro(PD0 - demanda.md * (12 - demanda.sd));   // demanda en Q = 12
  const ps = dentro(PS0 + oferta.ms * (88 - oferta.ss));     // oferta en Q = 88
  return (
    <g>
      <Marca x={M.l + 20} y={Y(132)} n="1" />
      <Marca x={X(94)} y={Y(0) - 20} n="2" />
      <Marca x={X(12)} y={Y(pd) - 20} n="3" />
      <Marca x={X(88)} y={Y(ps) + 22} n="4" />
      <Marca x={X(eq.q) + 20} y={Y(eq.p) - 20} n="5" />
    </g>
  );
}