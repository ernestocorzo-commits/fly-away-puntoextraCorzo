# Fly Away – Frontend

Aplicación web en React + TypeScript para la API de reserva de vuelos **Fly Away** (Laboratorio Semana 14, CS2031).

## Funcionalidades

- Registro de usuarios con validación de campos y errores del backend
- Login con JWT guardado en `localStorage` y nombre del usuario en la barra
- Búsqueda de vuelos por número, aerolínea y rango de fechas de salida
- Reserva de vuelos (solo con sesión iniciada) con ID de reserva
- Detalle de cada reserva
- Mis reservas, guardadas por usuario en `localStorage`
- Cierre de sesión y rutas protegidas

## Requisitos

- Node.js 20.19+ o 22.12+
- pnpm
- El backend de Fly Away corriendo en `http://localhost:8080` (requiere JDK 26)

## Cómo correrlo

1. Levanta el backend, en la carpeta del backend:

   ```bash
   ./mvnw spring-boot:run
   ```

   En PowerShell: `.\mvnw spring-boot:run`

2. En la carpeta de este proyecto:

   ```bash
   pnpm install
   pnpm dev
   ```

3. Abre `http://localhost:5173`.

Para probar sin registrarte puedes entrar con `ana.garcia@utec.edu.pe` / `Password1`.

## Estructura

```
src/
├── api.ts            # Cliente Axios (token en cada petición, manejo de 403)
├── App.tsx           # Rutas
├── main.tsx
├── index.css         # Estilos
├── auth/             # Contexto de autenticación, provider y hook useAuth
├── components/       # Alert, Navbar, ProtectedRoute
├── pages/            # Login, Registro, Búsqueda, Mis reservas, Detalle
└── utils/            # Formato de fechas y almacenamiento de reservas
```

## Notas

- El backend guarda todo en memoria: al reiniciarlo se borran los usuarios y reservas que hayas creado.
- No existe un endpoint que liste las reservas de un usuario, por eso los IDs se guardan en `localStorage`.