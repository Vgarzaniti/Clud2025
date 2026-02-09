# Trabajo Integrador de Desarrollo de Software Cloud

## 👨‍💻 Integrantes

- Garzaniti Valentin
- Sofia Raggi

---

## 🔗 Trello

[Enlace al tablero de Trello](https://trello.com/b/EFuHJtTS)

---

## 📌 Descripción General

**Foro Institucional** es una plataforma web desarrollada como proyecto académico para la materia **Desarrollo de software cloud** en la carrera de **Ingeniería en Sistemas**, cuyo objetivo es ofrecer un espacio de preguntas y respuestas para resolver consultas sobre parciales, actividades y poner conocimiento en comun entre estudiantes, ordenados por materias y carreras.

El sistema permite:

* Crear foros de discusión con archivos
* Responder foros con texto y archivos adjuntos
* Puntuar respuestas (útil / no útil)
* Visualizar rankings de respuestas
* Autenticación de usuarios
* Persistencia de archivos en la nube
* Deploy completo en infraestructura cloud

---

## 🧱 Arquitectura General

El sistema está dividido en **frontend**, **backend**, **base de datos** y **servicios cloud**, comunicados mediante HTTP/REST.

### Componentes principales

* **Frontend**: React + Vite (deploy estático en AWS S3)
* **Backend**: API REST (Django REST Framework) deployado en Render
* **Base de Datos**: Relacional (Render)
* **Almacenamiento de archivos**: AWS S3 + Cloudinary
* **Procesamiento asíncrono**: AWS Lambda

---

## 🌐 Frontend

### Tecnologías

* React
* Vite
* TailwindCSS
* Axios
* React Router
* Context API
* Framer Motion

### Funcionalidades

* Registro e inicio de sesión
* Rutas públicas y privadas
* Creación y visualización de foros
* Respuestas con adjuntos
* Ranking de respuestas
* Votación de respuestas
* Manejo de estados de carga

### Seguridad en Frontend

* Protección de rutas privadas
* Manejo de tokens JWT
* Validaciones de formularios
* Validación de archivos (tipo y tamaño)
* Prevención de doble envío

### Deploy Frontend (AWS S3)

1. Build del proyecto

```bash
npm run build
```

2. Subida del contenido de `/dist` a un bucket S3
3. Configuración de **Static Website Hosting**
4. Permisos públicos de lectura
5. Uso de variables de entorno para la API:

```env
VITE_API_URL=https://clud2025.onrender.com
```

El frontend queda accesible vía URL pública del bucket S3.


[Enlace a frontend deployado en S3](http://cloud2025-frontend-utn.s3-website-us-east-1.amazonaws.com)

---

## 🖥️ Backend

### Tecnologías

* Python
* Django
* Django REST Framework
* JWT Authentication

### Funcionalidades

* Autenticación y autorización
* CRUD de foros
* CRUD de respuestas
* CRUD de materias
* CRUD de carreras
* Sistema de votaciones y puntajes
* Gestión de archivos
* Control de permisos

### Seguridad Backend

* CORS configurado explícitamente
* Autenticación JWT
* Validación de archivos en backend
* Control de permisos por usuario

### Deploy Backend (Render)

* Servicio Web en Render
* Variables de entorno configuradas
* Migraciones automáticas
* Base de datos conectada

[URL del backend](https://clud2025.onrender.com)

---

## 🗄️ Base de Datos

### Modelo lógico principal

* Usuario
* Foro
* Respuesta
* Materia
* Carrera
* Archivo
* Puntaje

La base de datos mantiene integridad referencial y permite escalar funcionalidades futuras.

---

## ☁️ Gestión de Archivos (AWS + Cloudinary)

### Flujo de carga

1. Usuario sube archivo desde frontend
2. Backend recibe el archivo
3. AWS Lambda procesa el archivo
4. Archivo almacenado en S3 / Cloudinary
5. Se guarda referencia en la base de datos

### Seguridad

* Buckets privados
* Acceso mediante URLs firmadas
* No exposición directa del bucket

---

## 🔐 Seguridad General

Principales puntos tenidos en cuenta:

* Separación frontend / backend
* Tokens JWT
* CORS restrictivo
* Validaciones frontend y backend
* Buckets privados
* Variables de entorno

---

## 🚀 Flujo de Deploy

1. Backend deployado en Render
2. Frontend compilado y deployado en AWS S3
3. Comunicación vía API pública
4. Archivos gestionados en la nube

---

## 📈 Posibles Mejoras Futuras

* Notificaciones en tiempo real
* WebSockets
* Cache con Redis
* CDN (CloudFront)
* CI/CD completo
* Dominio personalizado

---

## 📄 Licencia

Proyecto académico – uso educativo.
