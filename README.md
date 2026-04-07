# NGL Cuba - Plataforma de Mensajes Anónimos

## Descripción
NGL Cuba es una plataforma moderna para recibir mensajes anónimos, similar a NGL pero con identidad cubana.

## Características
- Registro con usuario + contraseña
- Sistema de mensajes anónimos
- Perfiles con fotos
- Compartir en WhatsApp
- Diseño con bordes rojos neón
- Multi-dispositivo con Firebase

## Tecnologías
- Next.js 14
- Firebase Authentication
- Firestore Database
- Firebase Storage
- Tailwind CSS
- Lucide React Icons

## Instalación

1. Clonar el proyecto
2. Instalar dependencias:
```bash
npm install
```

3. Configurar Firebase:
- Crear proyecto en [Firebase Console](https://console.firebase.google.com)
- Activar Authentication (Email/Password)
- Activar Firestore Database
- Activar Storage
- Copiar credenciales en `.env.local`

4. Variables de entorno:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
NEXT_PUBLIC_BASE_URL=https://nglcuba.vercel.app
```

5. Ejecutar en desarrollo:
```bash
npm run dev
```

6. Build para producción:
```bash
npm run build
npm start
```

## Deploy
El proyecto está configurado para deploy en Vercel.

## Estructura del Proyecto
```
src/
  app/
    page.tsx              # Página principal
    register/page.tsx     # Registro
    login/page.tsx        # Login
    dashboard/page.tsx    # Dashboard del usuario
    messages/page.tsx     # Ver mensajes
    u/[username]/page.tsx # Enviar mensaje
  lib/
    firebase.ts           # Configuración de Firebase
```

## Funcionalidades

### Registro
- Usuario + contraseña
- Foto de perfil opcional
- Email interno automático: `usuario@nglcuba.com`

### Login
- Usuario + contraseña
- Convierte username a email interno

### Dashboard
- Copiar link personal
- Compartir en WhatsApp
- Ver mensajes
- Cerrar sesión

### Mensajes
- Enviar mensajes anónimos
- Recibir en tiempo real
- Eliminar mensajes

## Links
- Página principal: `/`
- Registro: `/register`
- Login: `/login`
- Dashboard: `/dashboard`
- Mensajes: `/messages`
- Perfil: `/u/[username]`

## Autor
Creado para la comunidad cubana
