import { BASE } from '../modelo';

const flecha = (d) => (Math.abs(d) < 0.05 ? '=' : d > 0 ? '▲' : '▼');
const verbo = (d) => (Math.abs(d) < 0.05 ? 'no cambia' : d > 0 ? 'sube' : 'baja');
const signo = (d) => (Math.abs(d) < 0.05 ? '0.0' : `${d > 0 ? '+' : ''}${d.toFixed(1)}`);

// Lista qué curvas se movieron respecto a la base
function causas({ sd, md, ss, ms }) {
  const t = [];
  if (sd !== BASE.sd) t.push(sd > 0 ? 'La demanda aumentó' : 'La demanda disminuyó');
  if (ss !== BASE.ss) t.push(ss > 0 ? 'La oferta aumentó' : 'La oferta disminuyó');
  if (md !== BASE.md) t.push('La demanda cambió de inclinación');
  if (ms !== BASE.ms) t.push('La oferta cambió de inclinación');
  return t;
}

// Hacia dónde se movió el punto de equilibrio en la gráfica
function direccion(dp, dq) {
  const v = Math.abs(dp) < 0.05 ? '' : dp > 0 ? 'hacia arriba' : 'hacia abajo';
  const h = Math.abs(dq) < 0.05 ? '' : dq > 0 ? 'hacia la derecha' : 'hacia la izquierda';
  if (!v && !h) return 'El punto de equilibrio no se movió.';
  return `El punto de equilibrio se mueve ${[v, h].filter(Boolean).join(' y ')}.`;
}

export default function QueCambio({ params, eq, base }) {
  const dp = eq.p - base.p;
  const dq = eq.q - base.q;
  const causa = causas(params);
  const frase = causa.length === 0
    ? 'Sin cambios: este es el mercado base.'
    : `${causa.join(' y ')}. ${direccion(dp, dq)} El precio de equilibrio ${verbo(dp)} y la cantidad de equilibrio ${verbo(dq)}.`;

  return (
    <div className="tarjeta-info">
      <b>Qué cambió respecto a la base</b>
      <table className="cambios">
        <thead>
          <tr><th></th><th>Base</th><th>Actual</th><th>Cambio</th></tr>
        </thead>
        <tbody>
          <tr><th>P*</th><td>{base.p.toFixed(1)}</td><td>{eq.p.toFixed(1)}</td><td className="cambios__delta">{flecha(dp)} {signo(dp)}</td></tr>
          <tr><th>Q*</th><td>{base.q.toFixed(1)}</td><td>{eq.q.toFixed(1)}</td><td className="cambios__delta">{flecha(dq)} {signo(dq)}</td></tr>
        </tbody>
      </table>
      <div style={{ fontSize: 14 }}>{frase}</div>
    </div>
  );
}
