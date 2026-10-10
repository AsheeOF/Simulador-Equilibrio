// Fondo decorativo: el logotipo de la UV flotando muy tenue detrás del contenido.
// El logotipo no se modifica (solo se baja su opacidad para que no estorbe la lectura).
const LOGOS = [
  { tam: 520, x: '72%', y: '8%',  dur: 46, delay: 0,   giro: 3 },
  { tam: 260, x: '-4%', y: '58%', dur: 38, delay: -12, giro: 4 },
  { tam: 130, x: '16%', y: '14%', dur: 30, delay: -6,  giro: 6 },
  { tam: 170, x: '58%', y: '78%', dur: 34, delay: -20, giro: 5 },
  { tam: 90,  x: '90%', y: '62%', dur: 26, delay: -9,  giro: 7 },
];

export default function FondoLogo() {
  const src = `${import.meta.env.BASE_URL}logo-uv.png`;
  return (
    <div className="fondo" aria-hidden="true">
      {LOGOS.map((l, i) => (
        <img key={i} className="fondo__logo" src={src} alt="" draggable="false"
          style={{
            width: l.tam, left: l.x, top: l.y,
            '--dur': `${l.dur}s`, '--delay': `${l.delay}s`, '--giro': `${l.giro}deg`,
          }} />
      ))}
    </div>
  );
}
