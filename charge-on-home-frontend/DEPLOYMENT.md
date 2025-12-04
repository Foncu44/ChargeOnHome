# Guía de Despliegue en Vercel

## Arquitectura del Proyecto

Este proyecto tiene una arquitectura separada:
- **Frontend (Angular)**: Se despliega en **Vercel**
- **Backend (Spring Boot)**: Se despliega en **Railway** o **Render**

## Paso 1: Desplegar el Backend

### Opción A: Railway (Recomendado)

1. Ve a [Railway.app](https://railway.app) y crea una cuenta
2. Crea un nuevo proyecto
3. Conecta tu repositorio de GitHub
4. Selecciona el directorio `charge-on-home-backend`
5. Railway detectará automáticamente que es un proyecto Maven/Java
6. Configura las variables de entorno:
   ```
   SPRING_PROFILES_ACTIVE=prod
   DATABASE_URL=jdbc:postgresql://aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=require
   DB_HOST=aws-1-eu-west-1.pooler.supabase.com
   DB_PORT=5432
   DB_NAME=postgres
   DB_USERNAME=postgres.uxsjdqooafmvzdazkqgz
   DB_PASSWORD=vp05UtP4NJzrdslu
   ```
7. Railway generará una URL como: `https://tu-proyecto.railway.app`
8. **Copia esta URL** - la necesitarás para el frontend

### Opción B: Render

1. Ve a [Render.com](https://render.com) y crea una cuenta
2. Crea un nuevo "Web Service"
3. Conecta tu repositorio de GitHub
4. Configura:
   - **Build Command**: `cd charge-on-home-backend && mvn clean package -DskipTests`
   - **Start Command**: `cd charge-on-home-backend && java -jar target/charge-on-home-backend-0.0.1-SNAPSHOT.jar`
   - **Root Directory**: `charge-on-home-backend`
5. Configura las mismas variables de entorno que en Railway
6. Render generará una URL como: `https://tu-proyecto.onrender.com`

## Paso 2: Configurar CORS en el Backend

Asegúrate de que `SecurityConfig.java` permita el origen de Vercel:

```java
@Value("${cors.allowed-origins}")
private String allowedOrigins;
```

Y en `application-prod.yml`:
```yaml
cors:
  allowed-origins: "https://tu-frontend.vercel.app,http://localhost:4200"
```

## Paso 3: Desplegar el Frontend en Vercel

1. Ve a [Vercel.com](https://vercel.com) y crea una cuenta
2. Importa tu repositorio de GitHub
3. Configura el proyecto:
   - **Framework Preset**: Angular
   - **Root Directory**: `charge-on-home-frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/charge-on-home-frontend/browser`
4. **Configura las variables de entorno**:
   - `NG_APP_API_URL` = `https://tu-backend-url.railway.app/api`
   - (O la URL de tu backend desplegado)
5. Haz deploy

## Paso 4: Verificar la Configuración

Después del deploy:
1. Verifica que el frontend carga correctamente
2. Abre la consola del navegador (F12)
3. Intenta hacer login o cargar garajes
4. Verifica que las peticiones van a la URL correcta del backend

## Solución de Problemas

### Error 404 en Vercel
- Verifica que `vercel.json` existe y está configurado correctamente
- Asegúrate de que el `outputDirectory` es correcto

### Error CORS
- Verifica que la URL del frontend está en `allowed-origins` del backend
- Asegúrate de que el backend está desplegado y accesible

### Error de conexión al backend
- Verifica que la variable de entorno `NG_APP_API_URL` está configurada en Vercel
- Verifica que la URL del backend es correcta y accesible

## Estructura del Proyecto

```
ChargeOnHome/
├── charge-on-home-frontend/    # → Desplegar en Vercel
│   ├── vercel.json
│   └── src/
│       └── environments/
│           ├── environment.ts          # Desarrollo
│           └── environment.prod.ts     # Producción
│
└── charge-on-home-backend/      # → Desplegar en Railway/Render
    ├── pom.xml
    └── src/
        └── main/
            └── resources/
                ├── application.yml
                ├── application-local.yml
                └── application-prod.yml
```

## Notas Importantes

- **No necesitas cambiar la arquitectura del proyecto** - mantener frontend y backend separados es la mejor práctica
- Vercel solo puede desplegar el frontend
- El backend debe estar en otra plataforma (Railway, Render, Heroku, etc.)
- Las variables de entorno se configuran en cada plataforma respectivamente

