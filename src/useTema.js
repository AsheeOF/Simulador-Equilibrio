import { useEffect, useState } from 'react';

const CLAVE = 'tema-simulador';

function inicial() {
  try {
    const guardado = localStorage.getItem(CLAVE);
    if (guardado === 'dark' || guardado === 'light') return guardado;
  } catch { /* sin acceso a localStorage: se usa la preferencia del sistema */ }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Devuelve [tema, alternar]. Aplica data-tema en <html> y recuerda la elección.
export default function useTema() {
  const [tema, setTema] = useState(inicial);

  useEffect(() => {
    document.documentElement.dataset.tema = tema;
    try { localStorage.setItem(CLAVE, tema); } catch { /* ignorar */ }
  }, [tema]);

  return [tema, () => setTema((t) => (t === 'dark' ? 'light' : 'dark'))];
}
