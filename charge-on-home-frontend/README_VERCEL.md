# Configuración para Vercel

## ⚠️ IMPORTANTE: Arquitectura del Proyecto

**NO necesitas cambiar la arquitectura del proyecto.** Mantener frontend y backend separados es la mejor práctica.

- **Frontend (Angular)**: Se despliega en **Vercel** ✅
- **Backend (Spring Boot)**: Se despliega en **Railway** o **Render** ✅

## Configuración en Vercel

### 1. Variables de Entorno

En el dashboard de Vercel, ve a:
**Settings → Environment Variables**

Agrega:
```
NG_APP_API_URL = https://tu-backend.railway.app/api
```
(Reemplaza con la URL real de tu backend desplegado)

### 2. Configuración del Proyecto

- **Framework Preset**: Angular
- **Root Directory**: `charge-on-home-frontend`
- **Build Command**: `npm run build:prod`
- **Output Directory**: `dist/charge-on-home-frontend/browser`

### 3. Actualizar index.html

Después de desplegar el backend, actualiza `src/index.html`:
```html
<script>
  window.__API_URL__ = 'https://tu-backend-real.railway.app/api';
</script>
```

O mejor aún, usa la variable de entorno de Vercel y actualiza `environment.prod.ts` para leerla.

## Solución del Error 404

El error 404 se soluciona con el archivo `vercel.json` que ya está configurado. Este archivo:
- Redirige todas las rutas a `/index.html` (necesario para Angular routing)
- Configura headers de seguridad
- Configura cache para assets

## Próximos Pasos

1. ✅ Despliega el backend en Railway (ver `charge-on-home-backend/DEPLOY_RAILWAY.md`)
2. ✅ Copia la URL del backend desplegado
3. ✅ Configura `NG_APP_API_URL` en Vercel
4. ✅ Actualiza `index.html` con la URL real del backend
5. ✅ Configura CORS en el backend para permitir tu dominio de Vercel

## Verificar que Funciona

1. Visita tu URL de Vercel
2. Abre la consola del navegador (F12)
3. Verifica que las peticiones van a la URL correcta del backend
4. Si hay errores CORS, agrega tu dominio de Vercel a `CORS_ALLOWED_ORIGINS` en Railway

