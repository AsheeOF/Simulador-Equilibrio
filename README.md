# Simulador de equilibrio de mercado

Proyecto académico de Microeconomía (Universidad Veracruzana). Permite mover las curvas de oferta y demanda, ver el punto de equilibrio (P*, Q*) y explorar excesos de oferta o demanda al fijar un precio.

## Funciones

- Plano cartesiano (P vs Q) con curvas de demanda y oferta que se arrastran o se ajustan con sliders (desplazamiento y pendiente).
- Equilibrio con proyecciones a los ejes y panel con P* y Q*.
- Precio de mercado ajustable: exceso de demanda (escasez) o de oferta (abundancia), con brecha y explicación.
- Escenarios del Paso 4 (sube la demanda, baja la oferta, escasez) con transiciones animadas.
- Demostración guiada, modo de anotaciones y texto grande para exponer.
- Excedente del consumidor y del productor (opcional).
- Botón para descargar la gráfica como PNG (con título, logotipo y valores). Se elige el nombre y la carpeta con el cuadro "Guardar como" del navegador (Chrome y Edge); en otros navegadores se pide el nombre en un cuadro propio.
- Fondo animado en JavaScript (canvas) con el logotipo de la UV.
- Modo claro y oscuro (recuerda tu elección y respeta la preferencia del sistema). La captura PNG respeta el modo activo (claro u oscuro).
- Barra anclada con las redes oficiales de la UV (sitio, Facebook y X), editable en `src/config.js`.

## Tecnologías

React 19 · Vite · JavaScript (ES modules) · SVG · Canvas · CSS con variables · Vitest · Oxlint

## Uso

```bash
npm install
npm run dev      # desarrollo
npm run build    # versión de producción
npm run lint
npm test         # pruebas del modelo (src/modelo.test.js)
```

## Personalización

- Enlaces de GitHub y lista de tecnologías: `src/config.js`
- Paleta (aproximada, no oficial) de la Universidad Veracruzana: variables `--uv-*` en `src/index.css`
- Logotipo: `public/logo-uv.png` (usar sin deformar ni cambiar sus colores)
- Intensidad del fondo animado: `src/components/FondoCanvas.jsx`
