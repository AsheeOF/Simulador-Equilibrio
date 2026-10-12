import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import Plano from './components/Plano';
import Curvas from './components/Curvas';
import Equilibrio from './components/Equilibrio';
import Desequilibrio from './components/Desequilibrio';
import Control from './components/Control';
import Escenarios from './components/Escenarios';
import QueCambio from './components/QueCambio';
import Anotaciones from './components/Anotaciones';
import Cabecera from './components/Cabecera';
import Pie from './components/Pie';
import FondoCanvas from './components/FondoCanvas';
import RedesUV from './components/RedesUV';
import useTema from './useTema';
import useAnimacion from './useAnimacion';
import Excedentes from './components/Excedentes';
import DialogoNombre from './components/DialogoNombre';
import { descargarConNombre, guardarConSelector, nombreSugerido } from './exportar';
import {
  DESPLAZ_MAX, PRECIO_MAX, BASE, ESCENARIOS, EXPLICACIONES, equilibrio, cantidades, excedentes,
} from './modelo';

const LEYENDA = [
  'Eje de precio (P)',
  'Eje de cantidad (Q)',
  'Curva de demanda (pendiente negativa)',
  'Curva de oferta (pendiente positiva)',
  'Punto de equilibrio con P* y Q*',
  'Controles de demanda, oferta y precio',
];

const DURACION_ANIM = 700;   
const DURACION_PASO = 4200;  
export default function App() {
  const [sd, setSd] = useState(0);
  const [md, setMd] = useState(1);
  const [ss, setSs] = useState(0);
  const [ms, setMs] = useState(1);
  const [pm, setPm] = useState(null); 
  const [anot, setAnot] = useState(false);
  const [grande, setGrande] = useState(false);
  const [demo, setDemo] = useState(null); 
  const [excedente, setExcedente] = useState(false);
  const [pista, setPista] = useState(true); 
  const [dialogoCaptura, setDialogoCaptura] = useState(null); 
  const [tema, alternarTema] = useTema();

  const params = { sd, md, ss, ms };
  const eq = equilibrio(params);
  const base = equilibrio(BASE);

  const precio = pm === null ? eq.p : pm;
  const { qd, qs } = cantidades(precio, params);
  const diferencia = precio - eq.p;
  const enEquilibrio = Math.abs(diferencia) < 0.5;

  const actual = ESCENARIOS.find((e) =>
    e.params.sd === sd && e.params.md === md &&
    e.params.ss === ss && e.params.ms === ms && e.precio === pm
  )?.id ?? null;

  // Las transiciones entre escenarios las mueve el hook useAnimacion
  const aplicar = (v, esFinal) => {
    setSd(v.sd); setMd(v.md); setSs(v.ss); setMs(v.ms);
    setPm(esFinal ? v.pmFinal : v.p);
  };
  const { animar, detener } = useAnimacion(aplicar, DURACION_ANIM);

  // Los valores actuales, para que `irA` arranque desde donde está todo ahora mismo
  const actualRef = useRef(null);
  useEffect(() => { actualRef.current = { sd, md, ss, ms, p: precio }; });

  // destino = { params: {sd, md, ss, ms}, precio: número o null (null = equilibrio) }
  const irA = useCallback((destino) => {
    const d = destino.params;
    animar(actualRef.current, { ...d, p: destino.precio ?? equilibrio(d).p, pmFinal: destino.precio });
  }, [animar]);

  const manual = (setter) => (v) => { detener(); setDemo(null); setPista(false); setter(v); };
  const elegir = (e) => { setDemo(null); irA(e); };
  const igualar = () => { setDemo(null); irA({ params, precio: null }); };
  const restablecer = () => { setDemo(null); irA(ESCENARIOS[0]); };

  // Demostración guiada: recorre los escenarios con una explicación en cada uno
  useEffect(() => {
    if (demo === null) return undefined;
    irA(ESCENARIOS[demo]);
    const t = setTimeout(() => setDemo(demo + 1 < ESCENARIOS.length ? demo + 1 : null), DURACION_PASO);
    return () => clearTimeout(t);
  }, [demo, irA]);

  const insignia = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 22, height: 22, borderRadius: '50%', background: 'var(--t-azul-osc)',
    color: 'var(--t-sobre)', fontSize: 12, fontWeight: 700, marginRight: 8,
  };

  const exc = excedentes(params, precio, qd, qs);
  const estadoTexto = enEquilibrio
    ? 'Mercado en equilibrio'
    : diferencia > 0 ? 'Exceso de oferta (abundancia)' : 'Exceso de demanda (escasez)';

  // Captura: la persona elige nombre y carpeta (cuadro nativo) o, si el navegador no lo permite, solo el nombre
  const capturar = async () => {
    const escenario = actual ? ESCENARIOS.find((e) => e.id === actual).nombre : 'Escenario personalizado';
    const datos = {
      nombre: escenario,
      lineas: [
        `P* = ${eq.p.toFixed(1)}    Q* = ${eq.q.toFixed(1)}    Precio de mercado = ${precio.toFixed(1)}`,
        `Qd = ${qd.toFixed(1)}    Qs = ${qs.toFixed(1)}    ${estadoTexto}${enEquilibrio ? '' : `    Brecha = ${Math.abs(qd - qs).toFixed(1)}`}`,
      ],
    };
    const sugerido = nombreSugerido(escenario);
    const resultado = await guardarConSelector(datos, sugerido);
    if (resultado === 'necesita-nombre') setDialogoCaptura({ datos, sugerido });
  };

  const yaEnEquilibrio = pm === null;
  const pasoDemo = demo !== null ? ESCENARIOS[demo] : null;

  return (
    <div className="app">
      <FondoCanvas tema={tema} />
      <RedesUV />
      <Cabecera tema={tema} onAlternarTema={alternarTema} />
      <Escenarios actual={actual} onElegir={elegir} />

      <div className="opciones">
        <button className="btn-demo" onClick={() => (demo === null ? setDemo(0) : (detener(), setDemo(null)))}>
          {demo === null ? '▶ Ver demostración' : '■ Detener demostración'}
        </button>
        <label>
          <input type="checkbox" checked={anot} onChange={(e) => setAnot(e.target.checked)} />
          {' '}Anotaciones para la captura
        </label>
        <label>
          <input type="checkbox" checked={excedente} onChange={(e) => setExcedente(e.target.checked)} />
          {' '}Mostrar excedentes
        </label>
        <label>
          <input type="checkbox" checked={grande} onChange={(e) => setGrande(e.target.checked)} />
          {' '}Texto grande para exponer
        </label>
      </div>

      {pasoDemo && (
        <div className="demo" role="status" key={pasoDemo.id}>
          <b>Paso {demo + 1} de {ESCENARIOS.length} · {pasoDemo.nombre}</b>
          <p>{EXPLICACIONES[pasoDemo.id]}</p>
          <div className="demo__barra"><span style={{ animationDuration: `${DURACION_PASO}ms` }} /></div>
        </div>
      )}

      <div className="layout">
        <div>
          <Plano>
            {excedente && <Excedentes params={params} precio={precio} qd={qd} qs={qs} />}
            <Curvas demanda={{ sd, md }} oferta={{ ss, ms }}
              setSd={manual(setSd)} setSs={manual(setSs)} />
            <Desequilibrio precio={precio} qd={qd} qs={qs}
              enEquilibrio={enEquilibrio} diferencia={diferencia} />
            <Equilibrio q={eq.q} p={eq.p} base={base} />
            {anot && <Anotaciones demanda={{ sd, md }} oferta={{ ss, ms }} eq={eq} />}
          </Plano>

          <div className="herramientas">
            {pista && <span className="pista">💡 Arrastra las curvas azul y verde con el mouse o el dedo</span>}
            <button className="btn-secundario" onClick={capturar}>📷 Descargar captura (PNG)</button>
          </div>

          {anot && (
            <ol className="leyenda">
              {LEYENDA.map((t) => <li key={t}>{t}</li>)}
            </ol>
          )}
        </div>

        <div style={{ zoom: grande ? 1.2 : 1 }}>
          <div className="tarjetas">
            <div className="tarjeta">
              <small>Precio de equilibrio</small>
              <div className="tarjeta__valor">P* = {eq.p.toFixed(1)}</div>
            </div>
            <div className="tarjeta">
              <small>Cantidad de equilibrio</small>
              <div className="tarjeta__valor">Q* = {eq.q.toFixed(1)}</div>
            </div>
          </div>

          <QueCambio params={params} eq={eq} base={base} />

          <section className="panel panel--demanda">
          <h2 className="titulo-demanda">
            {anot && <span style={insignia}>6</span>}Demanda
          </h2>
          <Control etiqueta="Desplazar" valor={sd} min={-DESPLAZ_MAX} max={DESPLAZ_MAX} paso={0.5} onChange={manual(setSd)} />
          <Control etiqueta="Pendiente" valor={md} min={0.4} max={1.8} paso={0.05} onChange={manual(setMd)} />
          </section>

          <section className="panel panel--oferta">
          <h2 className="titulo-oferta">Oferta</h2>
          <Control etiqueta="Desplazar" valor={ss} min={-DESPLAZ_MAX} max={DESPLAZ_MAX} paso={0.5} onChange={manual(setSs)} />
          <Control etiqueta="Pendiente" valor={ms} min={0.4} max={1.8} paso={0.05} onChange={manual(setMs)} />
          </section>

          <section className="panel panel--precio">
          <h2>Precio de mercado</h2>
          <Control etiqueta={yaEnEquilibrio ? 'Precio (libre: sigue al equilibrio)' : 'Precio fijado'}
            valor={precio} min={0} max={PRECIO_MAX} paso={0.5} onChange={manual(setPm)} />
          </section>

          <div className={`estado${enEquilibrio ? '' : ' estado--desequilibrio'}`} role="status">
            {enEquilibrio
              ? 'Mercado en equilibrio'
              : diferencia > 0
                ? 'Exceso de oferta (abundancia)'
                : 'Exceso de demanda (escasez)'}
            <div className="estado__detalle">
              Qd = {qd.toFixed(1)} · Qs = {qs.toFixed(1)}
              {!enEquilibrio && ` · Brecha = ${Math.abs(qd - qs).toFixed(1)}`}
            </div>
            {!enEquilibrio && (
              <div className="estado__detalle">
                {diferencia > 0
                  ? `Qs (${qs.toFixed(1)}) queda a la derecha de Qd (${qd.toFixed(1)}): se ofrece más de lo que se demanda, así que sobran productos y el precio tiende a bajar hacia P* = ${eq.p.toFixed(1)}.`
                  : `Qd (${qd.toFixed(1)}) queda a la derecha de Qs (${qs.toFixed(1)}): se demanda más de lo que se ofrece, así que faltan productos y el precio tiende a subir hacia P* = ${eq.p.toFixed(1)}.`}
              </div>
            )}
          </div>

          {excedente && (
            <div className="tarjeta-info excedentes-info">
              <b>Excedentes al precio actual</b>
              <div>Consumidor (EC): <b className="txt-azul">{exc.ec.toFixed(1)}</b> · Productor (EP): <b className="txt-verde">{exc.ep.toFixed(1)}</b></div>
              <div>Total: <b>{(exc.ec + exc.ep).toFixed(1)}</b> con Q = {exc.qt.toFixed(1)} unidades intercambiadas</div>
            </div>
          )}

          <div className="acciones">
            <button className="btn-principal" onClick={igualar}
              disabled={yaEnEquilibrio} aria-disabled={yaEnEquilibrio}>
              {yaEnEquilibrio ? '✓ Precio en equilibrio' : 'Igualar al equilibrio'}
            </button>
            <button className="btn-secundario" onClick={restablecer}>Restablecer todo</button>
          </div>
        </div>
      </div>

      <Pie />

      {dialogoCaptura && (
        <DialogoNombre sugerido={dialogoCaptura.sugerido}
          onCancelar={() => setDialogoCaptura(null)}
          onGuardar={(nombre) => {
            descargarConNombre(dialogoCaptura.datos, nombre, dialogoCaptura.sugerido);
            setDialogoCaptura(null);
          }} />
      )}
    </div>
  );
}
