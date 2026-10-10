import { ESCENARIOS } from '../modelo';

export default function Escenarios({ actual, onElegir }) {
  return (
    <div className="escenarios" role="group" aria-label="Escenarios predefinidos">
      {ESCENARIOS.map((e) => {
        const activo = actual === e.id;
        return (
          <button key={e.id} onClick={() => onElegir(e)} aria-pressed={activo}
            className={`btn-escenario${activo ? ' btn-escenario--activo' : ''}`}>
            {e.nombre}
          </button>
        );
      })}
    </div>
  );
}
