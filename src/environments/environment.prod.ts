// Obtener la URL del backend desde variable de entorno o window
const getApiUrl = (): string => {
  // Primero intenta desde window (inyectado en index.html en tiempo de ejecución)
  if (typeof window !== 'undefined' && (window as any).__API_URL__) {
    const apiUrl = (window as any).__API_URL__;
    if (apiUrl && !apiUrl.includes('tu-backend-url')) {
      return apiUrl;
    }
  }
  
  // Luego desde variable de entorno (Vercel inyecta estas en build time)
  // Vercel expone variables con prefijo NG_APP_ o VITE_
  const envApiUrl = 
    (typeof process !== 'undefined' && process.env['NG_APP_API_URL']) ||
    (typeof process !== 'undefined' && process.env['VITE_API_URL']);
  
  if (envApiUrl) {
    return envApiUrl;
  }
  
  // Fallback: URL por defecto - ACTUALIZAR con tu backend desplegado
  console.warn('⚠️ API URL no configurada. Usando URL por defecto. Configura NG_APP_API_URL en Vercel.');
  return 'https://tu-backend-url.railway.app/api';
};

export const environment = {
  production: true,
  apiUrl: getApiUrl()
};
