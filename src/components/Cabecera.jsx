import IconoGitHub from './IconoGitHub';
import { IconoLuna, IconoSol } from '../iconos';
import { GITHUB_PERFIL } from '../config';

export default function Cabecera({ tema, onAlternarTema }) {
  const oscuro = tema === 'dark';
  return (
    <header className="cabecera">
      {/* El logotipo va sobre una placa blanca para respetar sus colores en ambos modos */}
      <div className="cabecera__marca">
        <img className="cabecera__logo" src={`${import.meta.env.BASE_URL}logo-uv.png`} alt="Logotipo de la Universidad Veracruzana" />
      </div>
      <div className="cabecera__texto">
        <h1 className="cabecera__titulo">Simulador de equilibrio de mercado</h1>
        <p className="cabecera__sub">Microeconomía · Oferta y demanda</p>
      </div>
      <button className="btn-tema" onClick={onAlternarTema} aria-pressed={oscuro}
        aria-label={oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        title={oscuro ? 'Modo claro' : 'Modo oscuro'}>
        {oscuro ? <IconoSol /> : <IconoLuna />}
      </button>
      <a className="btn-github" href={GITHUB_PERFIL} target="_blank" rel="noopener noreferrer"
         aria-label="Ver mi perfil de GitHub (se abre en una pestaña nueva)">
        <IconoGitHub /> GitHub
      </a>
    </header>
  );
}
