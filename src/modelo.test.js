import { describe, expect, it } from 'vitest';
import { BASE, ESCENARIOS, QMAX, PMAX, cantidades, equilibrio, excedentes } from './modelo';

const cerca = (a, b) => expect(a).toBeCloseTo(b, 9);

describe('equilibrio', () => {
  it('mercado base: P* = 55 y Q* = 45', () => {
    const e = equilibrio(BASE);
    cerca(e.p, 55); cerca(e.q, 45);
  });
  it('escenario 1: sube la demanda (P* y Q* aumentan)', () => {
    const e = equilibrio({ ...BASE, sd: 15 });
    cerca(e.p, 62.5); cerca(e.q, 52.5);
  });
  it('escenario 2: baja la oferta (P* sube, Q* baja)', () => {
    const e = equilibrio({ ...BASE, ss: -15 });
    cerca(e.p, 62.5); cerca(e.q, 37.5);
  });
  it('baja la demanda y sube la oferta (casos simétricos)', () => {
    const a = equilibrio({ ...BASE, sd: -15 });
    cerca(a.p, 47.5); cerca(a.q, 37.5);
    const b = equilibrio({ ...BASE, ss: 15 });
    cerca(b.p, 47.5); cerca(b.q, 52.5);
  });
  it('en el equilibrio Qd = Qs para cualquier combinación de controles', () => {
    for (let sd = -20; sd <= 20; sd += 5)
      for (let ss = -20; ss <= 20; ss += 5)
        for (const md of [0.4, 1, 1.8])
          for (const ms of [0.4, 1, 1.8]) {
            const par = { sd, md, ss, ms };
            const e = equilibrio(par);
            const c = cantidades(e.p, par);
            cerca(c.qd, c.qs);
          }
  });
  it('el equilibrio siempre cabe en la gráfica (0..QMAX, 0..PMAX)', () => {
    for (let sd = -20; sd <= 20; sd += 10)
      for (let ss = -20; ss <= 20; ss += 10)
        for (const md of [0.4, 1.8])
          for (const ms of [0.4, 1.8]) {
            const e = equilibrio({ sd, md, ss, ms });
            expect(e.q).toBeGreaterThanOrEqual(0);
            expect(e.q).toBeLessThanOrEqual(QMAX);
            expect(e.p).toBeGreaterThanOrEqual(0);
            expect(e.p).toBeLessThanOrEqual(PMAX);
          }
  });
});

describe('cantidades a un precio dado', () => {
  it('escenario 3: con P = 35 hay escasez (Qd = 65, Qs = 25)', () => {
    const c = cantidades(35, BASE);
    cerca(c.qd, 65); cerca(c.qs, 25);
    expect(c.qd).toBeGreaterThan(c.qs); // Qd queda a la derecha de Qs
  });
  it('con P = 75 hay abundancia (Qd = 25, Qs = 65)', () => {
    const c = cantidades(75, BASE);
    cerca(c.qd, 25); cerca(c.qs, 65);
  });
  it('nunca devuelve cantidades negativas', () => {
    expect(cantidades(0, BASE).qs).toBe(0);
    expect(cantidades(140, BASE).qd).toBe(0);
  });
});

describe('excedentes', () => {
  it('en el equilibrio base: EC = EP = 1012.5', () => {
    const e = equilibrio(BASE);
    const x = excedentes(BASE, e.p, ...Object.values(cantidades(e.p, BASE)));
    cerca(x.ec, 1012.5); cerca(x.ep, 1012.5);
  });
});

describe('escenarios predefinidos', () => {
  it('el escenario de escasez fija el precio en 35', () => {
    expect(ESCENARIOS.find((e) => e.id === 'escasez').precio).toBe(35);
  });
});
