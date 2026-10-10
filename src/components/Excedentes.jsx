import { M, W, H, X, Y, excedentes } from '../modelo';

// Sombrea el excedente del consumidor (azul) y del productor (verde)
export default function Excedentes({ params, precio, qd, qs }) {
  const x = excedentes(params, precio, qd, qs);
  if (x.qt < 0.5) return null;

  const pts = (lista) => lista.map(([q, p]) => `${X(q)},${Y(p)}`).join(' ');
  const consumidor = [[0, x.pd0], [x.qt, x.pdt], [x.qt, precio], [0, precio]];
  const productor = [[0, precio], [x.qt, precio], [x.qt, x.pst], [0, x.ps0]];
  // Posición de las etiquetas: cerca del eje P, a mitad de camino entre el precio y cada curva
  const q = x.qt * 0.12;
  const pdq = x.pd0 + (x.pdt - x.pd0) * 0.12;
  const psq = x.ps0 + (x.pst - x.ps0) * 0.12;
  const yEC = Y(precio + (pdq - precio) * 0.6);
  const yEP = Y(precio - (precio - psq) * 0.5);
  const cx = X(q) + 6;
  const grande = x.qt > 14;

  return (
    <g>
      <defs>
        <clipPath id="area-excedentes">
          <rect x={M.l} y={M.t} width={W - M.l - M.r} height={H - M.t - M.b} />
        </clipPath>
      </defs>
      <g clipPath="url(#area-excedentes)" className="excedentes">
        <polygon points={pts(consumidor)} fill="var(--t-azul)" opacity="0.2" />
        <polygon points={pts(productor)} fill="var(--t-verde)" opacity="0.25" />
      </g>
      {grande && (
        <g fontSize="12" fontWeight="700">
          <text x={cx} y={yEC} fill="var(--t-azul-osc)">EC</text>
          <text x={cx} y={yEP} fill="var(--t-verde-osc)">EP</text>
        </g>
      )}
    </g>
  );
}
