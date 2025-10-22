🧠 InterviewSim – Backend
📌 Descripción general

El backend de InterviewSim implementa toda la lógica del sistema de entrevistas automatizadas basadas en inteligencia artificial.
Su objetivo principal es generar preguntas de programación tipo opción múltiple utilizando la API de OpenAI, almacenar los resultados en MongoDB, y proporcionar una interfaz segura para la autenticación y el consumo desde el frontend.
El sistema fue desarrollado con Node.js y Express, aplicando arquitectura modular y principios RESTful,
garantizando escalabilidad y mantenimiento a futuro.

🌐 Conexión con el Backend
const baseURL = import.meta.env.VITE_APP_BASE_URL_DEV;
axios.post(`${baseURL}/api/interview`, data);
Asegúrate de que el backend esté corriendo en el puerto 8000 o el que especifiques.

🚀 Tecnologías utilizadas
Categoría	                         Tecnología
Lenguaje principal               	Node.js (ES6)
Framework web                   	Express.js
Base de datos	                    MongoDB (Mongoose)
API IA	                          OpenAI GPT-3.5 Turbo
Validación	                      Zod
Correo	                          Nodemailer
Seguridad                       	CORS, bcryptjs, dotenv
Monitoreo	                        Morgan
Manejo de errores               	Middlewares personalizados

⚙️ Requisitos previos
Asegúrate de tener instalado:
Node.js v18 o superior
MongoDB local o en la nube (MongoDB Atlas)
📂 Estructura del proyecto
InterviewSim-Backend/
│
├── src/
│   ├── index.js                 # Punto de entrada del servidor
│   ├── app.js                   # Configuración de Express, CORS y middlewares
│   ├── db.js                    # Conexión con MongoDB
│   │
│   ├── routes/                  # Definición de rutas del sistema
│   │   ├── auth.routes.js       # Rutas de autenticación
│   │   ├── interwiew.routes.js  # (typo, debería ser interview.routes.js)
│   │
│   ├── controllers/             # Lógica de negocio
│   │   ├── auth.controllers.js
│   │   ├── interview.controllers.js
│   │
│   ├── models/                  # Esquemas de Mongoose
│   │   ├── user.model.js
│   │   ├── interview.model.js
│   │
│   ├── middlewares/             # Validaciones y JWT
│   │   ├── auth.middleware.js
│   │
│   ├── IA/                      # Integración con OpenAI
│   │   ├── ia.controller.js
│   │   ├── openaiConfig.js
│   │
│   ├── utils/                   # Funciones auxiliares
│   │   ├── email.js
│   │   ├── handleError.js
│   │
│   └── schemas/                 # Validaciones Zod
│
├── .env                         # Variables de entorno (no incluir en repo)
├── package.json
└── README.md


Una API Key de OpenAI
🧱 Rutas principales
Ruta	Descripción
/login	Ingreso del usuario
/register	Registro de cuenta
/interview	Simulación de entrevista con IA
/results	Resultados y estadísticas del usuario

⚙️ Configuración del entorno
RUNNING_BACKEND=8000
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/interviewsim
OPENAI_API_KEY=sk-<tu_api_key>
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contraseña
NODE_ENV=development

🧩 Instalación y ejecución
1️⃣ Clonar el repositorio o descomprimir el proyecto.
2️⃣ Instalar dependencias:
npm install
3️⃣ Ejecutar en modo desarrollo:
npm run dev
4️⃣ O en modo producción:
npm start
El servidor se ejecutará por defecto en:
http://localhost:8000

🧠 Funcionamiento del módulo de IA (OpenAI)

El módulo encargado de generar preguntas se encuentra en src/IA/.
El flujo general es el siguiente:

El usuario elige nivel de dificultad y lenguaje de programación desde el frontend.

El backend construye un prompt dinámico, por ejemplo:
Genera 5 preguntas de programación de nivel intermedio sobre JavaScript 
en formato de opción múltiple (A, B, C, D), indicando la respuesta correcta 
y una breve explicación.

Se envía el prompt mediante una solicitud HTTP al modelo gpt-3.5-turbo.
El backend recibe el texto con las preguntas generadas.
Se formatean los resultados y se guardan en MongoDB.
El frontend las muestra al usuario en la simulación.
Parámetros usados:
temperature: 0.7 → Equilibrio entre creatividad y precisión.
max_tokens: 1000 → Controla la extensión de la respuesta.
model: gpt-3.5-turbo

🧩 Autor
Nilson Andrés Cuero Ocoro
Sebastian Perez Bastidas
Proyecto académico: InterviewSim
Facultad de Ingeniería de Sistemas
