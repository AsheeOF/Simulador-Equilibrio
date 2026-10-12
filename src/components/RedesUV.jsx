import { memo } from 'react';
import { REDES_UV } from '../config';
import { IconoFacebook, IconoInstagram, IconoWeb, IconoX, IconoYouTube } from '../iconos';

const ICONOS = {
  web: IconoWeb, facebook: IconoFacebook, x: IconoX,
  instagram: IconoInstagram, youtube: IconoYouTube,
};

// Barra anclada (siempre visible) con las redes oficiales de la UV
function RedesUV() {
  return (
    <nav className="redes" aria-label="Redes oficiales de la Universidad Veracruzana">
      <span className="redes__titulo">UV</span>
      {REDES_UV.map((r) => {
        const Icono = ICONOS[r.icono] ?? IconoWeb;
        return (
          <a key={r.url} className="redes__enlace" href={r.url} target="_blank"
             rel="noopener noreferrer" aria-label={`${r.nombre} (se abre en una pestaña nueva)`}>
            <Icono />
            <span className="redes__tip" aria-hidden="true">{r.nombre}</span>
          </a>
        );
      })}
    </nav>
  );
}

// No cambia mientras la animación redibuja la pantalla en cada cuadro
export default memo(RedesUV);
