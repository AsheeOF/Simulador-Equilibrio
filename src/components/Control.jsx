import { useId } from 'react';

export default function Control({ etiqueta, valor, min, max, paso, onChange }) {
  const id = useId();
  return (
    <div className="control">
      <div className="control__fila">
        <label htmlFor={id}>{etiqueta}</label>
        <b>{valor.toFixed(2)}</b>
      </div>
      <input id={id} type="range" min={min} max={max} step={paso} value={valor}
        onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}
