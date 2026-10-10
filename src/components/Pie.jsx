import IconoGitHub from './IconoGitHub';
import { GITHUB_REPO, TECNOLOGIAS } from '../config';

export default function Pie() {
  return (
    <footer className="pie">
      <h2>Tecnologías utilizadas</h2>
      <ul className="pie__lista">
        {TECNOLOGIAS.map((t) => (
          <li key={t.nombre} className="chip">{t.nombre}<small>{t.uso}</small></li>
        ))}
      </ul>
      <a className="btn-github" href={GITHUB_REPO} target="_blank" rel="noopener noreferrer">
        <IconoGitHub /> Ver el repositorio
      </a>
      <p className="pie__nota">Proyecto académico · Universidad Veracruzana</p>
    </footer>
  );
}
