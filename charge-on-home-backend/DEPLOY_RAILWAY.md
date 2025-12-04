# Desplegar Backend en Railway

## Pasos para Desplegar

1. **Crear cuenta en Railway**
   - Ve a [railway.app](https://railway.app)
   - Crea una cuenta con GitHub

2. **Crear nuevo proyecto**
   - Click en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Selecciona tu repositorio `ChargeOnHome`
   - Selecciona el directorio `charge-on-home-backend`

3. **Configurar Variables de Entorno**
   En Railway, ve a Variables y agrega:
   ```
   SPRING_PROFILES_ACTIVE=prod
   DATABASE_URL=jdbc:postgresql://aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=require
   DB_HOST=aws-1-eu-west-1.pooler.supabase.com
   DB_PORT=5432
   DB_NAME=postgres
   DB_USERNAME=postgres.uxsjdqooafmvzdazkqgz
   DB_PASSWORD=vp05UtP4NJzrdslu
   ```

4. **Configurar CORS**
   Agrega también:
   ```
   CORS_ALLOWED_ORIGINS=https://tu-frontend.vercel.app,http://localhost:4200
   ```

5. **Obtener la URL del Backend**
   - Railway generará una URL como: `https://tu-proyecto.railway.app`
   - Copia esta URL completa

6. **Configurar en Vercel**
   - Ve a tu proyecto en Vercel
   - Settings → Environment Variables
   - Agrega: `NG_APP_API_URL` = `https://tu-proyecto.railway.app/api`

## Verificar Despliegue

1. Visita: `https://tu-proyecto.railway.app/api/health/check`
2. Deberías ver: `{"status":"UP","message":"Backend is running"}`

