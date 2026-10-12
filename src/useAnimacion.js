import { useCallback, useEffect, useRef } from 'react';

const CLAVES = ['sd', 'md', 'ss', 'ms', 'p'];

const sinMovimiento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mueve suavemente varios valores numéricos desde un estado inicial hasta uno final
// (con una curva que frena al llegar). Se usa para las transiciones entre escenarios.
//
//   const { animar, detener } = useAnimacion(aplicar, 700);
//   animar(desde, hasta)    // desde/hasta: { sd, md, ss, ms, p, ... }
//
// `aplicar(valores, esFinal)` recibe los valores de cada cuadro; en el último llega
// el objeto `hasta` completo, para que el estado final quede exacto.
export default function useAnimacion(aplicar, duracion = 700) {
  const raf = useRef(null);
  const aplicarRef = useRef(aplicar);

  useEffect(() => { aplicarRef.current = aplicar; });

  const detener = useCallback(() => {
    cancelAnimationFrame(raf.current);
    raf.current = null;
  }, []);

  const animar = useCallback((desde, hasta) => {
    detener();

    // Con "movimiento reducido" no hay transición: se salta directo al destino
    if (sinMovimiento()) {
      raf.current = requestAnimationFrame(() => {
        raf.current = null;
        aplicarRef.current(hasta, true);
      });
      return;
    }

    let inicio = null;
    const paso = (t) => {
      if (inicio === null) inicio = t;
      const k = Math.min(1, (t - inicio) / duracion);
      if (k >= 1) {
        raf.current = null;
        aplicarRef.current(hasta, true);
        return;
      }
      const suave = 1 - Math.pow(1 - k, 3);
      const valores = {};
      for (const c of CLAVES) valores[c] = desde[c] + (hasta[c] - desde[c]) * suave;
      aplicarRef.current(valores, false);
      raf.current = requestAnimationFrame(paso);
    };
    raf.current = requestAnimationFrame(paso);
  }, [detener, duracion]);

  useEffect(() => detener, [detener]);

  return { animar, detener };
}
