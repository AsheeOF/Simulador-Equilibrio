// Tamaño del lienzo SVG y márgenes para los ejes
export const W = 680;
export const H = 500;
export const M = { l: 66, r: 26, t: 20, b: 58 };

// Rango de los ejes: Q y P van de 0 a 140 (así el equilibrio siempre cabe
// en la gráfica, incluso con los controles al máximo)
export const QMAX = 140;
export const PMAX = 140;

// Convierten valores de la economía (Q, P) a posición en pantalla
export const X = (q) => M.l + (q / QMAX) * (W - M.l - M.r);
export const Y = (p) => H - M.b - (p / PMAX) * (H - M.t - M.b);

// Parámetros base de las curvas
export const PD0 = 100;      // precio máximo de la demanda (cuando Q = 0)
export const PS0 = 10;       // precio mínimo de la oferta (cuando Q = 0)
export const DESPLAZ_MAX = 20;
export const PRECIO_MAX = 140;

// Punto de equilibrio: donde se igualan las dos ecuaciones
export function equilibrio({ sd, md, ss, ms }) {
  const q = (PD0 - PS0 + md * sd + ms * ss) / (md + ms);
  const p = PD0 - md * (q - sd);
  return { q, p };
}

// Dos puntos de cada recta (suficientes para dibujarla)
export function puntosDemanda({ sd, md }) {
  return [[sd + (PD0 - PMAX) / md, PMAX], [sd + PD0 / md, 0]];
}
export function puntosOferta({ ss, ms }) {
  return [[0, PS0 - ms * ss], [QMAX, PS0 + ms * (QMAX - ss)]];
}

// Cantidades demandada y ofrecida a un precio dado
export function cantidades(P, { sd, md, ss, ms }) {
  return {
    qd: Math.max(0, sd + (PD0 - P) / md),
    qs: Math.max(0, ss + (P - PS0) / ms),
  };
}

// Valores iniciales de las curvas (también son la "curva fantasma")
export const BASE = { sd: 0, md: 1, ss: 0, ms: 1 };

// Escenarios del Paso 4 del documento, listos con un clic
export const ESCENARIOS = [
  { id: 'base',    nombre: 'Base',               params: BASE,                 precio: null },
  { id: 'demanda', nombre: '1. Sube la demanda', params: { ...BASE, sd: 15 },  precio: null },
  { id: 'oferta',  nombre: '2. Baja la oferta',  params: { ...BASE, ss: -15 }, precio: null },
  { id: 'escasez', nombre: '3. Escasez',         params: BASE,                 precio: 35 },
];

// Texto que explica cada escenario (se usa en la demostración guiada)
export const EXPLICACIONES = {
  base: 'Mercado base: la demanda baja y la oferta sube. Se cruzan en P* = 55 y Q* = 45.',
  demanda: 'Los compradores quieren más: la demanda se desplaza a la derecha. El equilibrio sube y se mueve a la derecha: P* y Q* aumentan.',
  oferta: 'Los vendedores ofrecen menos: la oferta se desplaza a la izquierda. El precio sube, pero la cantidad baja: P* aumenta y Q* disminuye.',
  escasez: 'Con el precio por debajo de P*, Qd queda a la derecha de Qs: se quiere comprar más de lo que se ofrece (exceso de demanda), y el precio tiende a subir.',
};

// Excedentes al precio de mercado. La cantidad intercambiada es la menor entre
// Qd y Qs (con escasez se vende lo que se ofrece; con abundancia, lo que se demanda).
export function excedentes({ sd, md, ss, ms }, precio, qd, qs) {
  const qt = Math.min(qd, qs);
  const pd = (q) => PD0 - md * (q - sd);   // precio máximo que paga la demanda
  const ps = (q) => PS0 + ms * (q - ss);   // precio mínimo que acepta la oferta
  const ec = 0.5 * ((pd(0) - precio) + (pd(qt) - precio)) * qt;
  const ep = 0.5 * ((precio - ps(0)) + (precio - ps(qt))) * qt;
  return { qt, ec, ep, pd0: pd(0), pdt: pd(qt), ps0: ps(0), pst: ps(qt) };
}
