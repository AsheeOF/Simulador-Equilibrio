import { useEffect, useRef, useState } from 'react';

// Cuadro para escribir el nombre de la captura (se usa cuando el navegador
// no ofrece el cuadro nativo de "Guardar como").
export default function DialogoNombre({ sugerido, onGuardar, onCancelar }) {
  const [nombre, setNombre] = useState(sugerido);
  const campo = useRef(null);

  useEffect(() => {
    campo.current?.focus();
    campo.current?.select();
    const alTeclear = (e) => { if (e.key === 'Escape') onCancelar(); };
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  }, [onCancelar]);

  return (
    <div className="dialogo__fondo" onMouseDown={(e) => { if (e.target === e.currentTarget) onCancelar(); }}>
      <div className="dialogo" role="dialog" aria-modal="true" aria-labelledby="dialogo-titulo">
        <h2 id="dialogo-titulo">Guardar captura</h2>
        <label htmlFor="nombre-captura">Nombre del archivo</label>
        <div className="dialogo__campo">
          <input id="nombre-captura" ref={campo} value={nombre} maxLength={80}
            onChange={(e) => setNombre(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onGuardar(nombre); }} />
          <span>.png</span>
        </div>
        <p className="dialogo__nota">
          Tu navegador la guardará en su carpeta de descargas (o te preguntará dónde,
          si tienes activada esa opción en su configuración).
        </p>
        <div className="dialogo__acciones">
          <button className="btn-secundario" onClick={onCancelar}>Cancelar</button>
          <button className="btn-principal" onClick={() => onGuardar(nombre)}>Guardar</button>
        </div>
      </div>
    </div>
  );
}
