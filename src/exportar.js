// Captura de la gráfica como imagen PNG (con título, logotipo y valores clave).
// La imagen respeta el modo activo (claro u oscuro).

const cargar = (src) => new Promise((ok, mal) => {
  const img = new Image();
  img.onload = () => ok(img);
  img.onerror = mal;
  img.src = src;
});

// ---------------------------------------------------------------------
// 1) Nombre del archivo
// ---------------------------------------------------------------------

// Nombre que se propone por defecto. Cámbialo aquí si quieres otra nomenclatura.
// Ejemplo de resultado: "simulador-3-escasez-oscuro.png"
export function nombreSugerido(escenario) {
  const modo = document.documentElement.dataset.tema === 'dark' ? 'oscuro' : 'claro';
  const base = escenario.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `simulador-${base}-${modo}`;
}

// Quita caracteres que los sistemas de archivos no permiten y asegura la extensión .png
export function limpiarNombre(texto, respaldo) {
  const base = texto.replace(/\.png$/i, '').replace(/[\\/:*?"<>|]+/g, '').trim();
  return `${base || respaldo}.png`;
}

// ---------------------------------------------------------------------
// 2) Generar la imagen
// ---------------------------------------------------------------------

async function generarBlob({ nombre, lineas }) {
  const svg = document.querySelector('svg.plano');
  const [, , W, H] = svg.getAttribute('viewBox').split(' ').map(Number);

  const css = getComputedStyle(document.documentElement);
  const token = (n) => css.getPropertyValue(n).trim();
  const colFondo = token('--t-superficie');
  const colAzul = token('--t-azul');
  const colSec = token('--t-texto-sec');
  const colTexto = token('--t-texto');

  // Copia del SVG con colores reales (un SVG suelto no entiende var(--t-...))
  const copia = svg.cloneNode(true);
  copia.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  copia.setAttribute('width', W); copia.setAttribute('height', H);
  copia.setAttribute('font-family', 'system-ui, -apple-system, "Segoe UI", Arial, sans-serif');
  copia.removeAttribute('style');
  copia.setAttribute('fill', colTexto); // los textos sin color propio heredan el del tema
  const fondo = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  fondo.setAttribute('width', W); fondo.setAttribute('height', H); fondo.setAttribute('fill', colFondo);
  copia.insertBefore(fondo, copia.firstChild);
  const texto = new XMLSerializer().serializeToString(copia)
    .replace(/var\((--[\w-]+)\)/g, (_, n) => token(n));

  const urlSvg = URL.createObjectURL(new Blob([texto], { type: 'image/svg+xml;charset=utf-8' }));
  const [grafica, logo] = await Promise.all([
    cargar(urlSvg),
    cargar(`${import.meta.env.BASE_URL}logo-uv.png`),
  ]);
  URL.revokeObjectURL(urlSvg);

  const esc = 2;                       // 2x para que se vea nítida en el reporte
  const alto = 84, pie = 28 + lineas.length * 22;
  const lienzo = document.createElement('canvas');
  lienzo.width = W * esc; lienzo.height = (alto + H + pie) * esc;
  const c = lienzo.getContext('2d');
  c.scale(esc, esc);
  c.fillStyle = colFondo; c.fillRect(0, 0, W, alto + H + pie);

  // Encabezado: placa blanca detrás del logotipo para que conserve sus colores en modo oscuro
  const alt = 62, anc = alt * (logo.naturalWidth / logo.naturalHeight);
  const px = 8, py = 6, pw = anc + 12, ph = alt + 10, r = 10;
  c.fillStyle = '#FFFFFF';
  c.beginPath();
  c.moveTo(px + r, py); c.arcTo(px + pw, py, px + pw, py + ph, r);
  c.arcTo(px + pw, py + ph, px, py + ph, r); c.arcTo(px, py + ph, px, py, r);
  c.arcTo(px, py, px + pw, py, r); c.closePath(); c.fill();
  c.drawImage(logo, 14, 11, anc, alt);
  c.fillStyle = colAzul;
  c.font = '700 22px system-ui, -apple-system, "Segoe UI", Arial, sans-serif';
  c.fillText('Simulador de equilibrio de mercado', anc + 34, 38);
  c.fillStyle = colSec;
  c.font = '14px system-ui, -apple-system, "Segoe UI", Arial, sans-serif';
  c.fillText(`Microeconomía · ${nombre}`, anc + 34, 60);
  c.fillStyle = colAzul;
  c.fillRect(0, alto - 4, W, 4);

  c.drawImage(grafica, 0, alto, W, H);

  // Pie con los valores
  c.fillStyle = colTexto;
  c.font = '600 15px system-ui, -apple-system, "Segoe UI", Arial, sans-serif';
  lineas.forEach((t, i) => c.fillText(t, 18, alto + H + 24 + i * 22));

  return new Promise((ok, mal) =>
    lienzo.toBlob((b) => (b ? ok(b) : mal(new Error('No se pudo crear la imagen'))), 'image/png'));
}

// ---------------------------------------------------------------------
// 3) Guardar
// ---------------------------------------------------------------------

// Opción A: cuadro nativo "Guardar como" (Chrome, Edge): la persona elige nombre y carpeta.
export async function guardarConSelector(datos, sugerido) {
  if (!('showSaveFilePicker' in window)) return 'necesita-nombre';
  let archivo;
  try {
    archivo = await window.showSaveFilePicker({
      suggestedName: `${sugerido}.png`,
      types: [{ description: 'Imagen PNG', accept: { 'image/png': ['.png'] } }],
    });
  } catch (e) {
    if (e.name === 'AbortError') return 'cancelado';  
    return 'necesita-nombre';                        
  }
  const blob = await generarBlob(datos);
  const flujo = await archivo.createWritable();
  await flujo.write(blob);
  await flujo.close();
  return 'guardado';
}

// Opción B: descarga normal con el nombre que la persona escribió (Firefox, Safari...).
export async function descargarConNombre(datos, nombreElegido, sugerido) {
  const blob = await generarBlob(datos);
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.download = limpiarNombre(nombreElegido, sugerido);
  enlace.href = url;
  enlace.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
