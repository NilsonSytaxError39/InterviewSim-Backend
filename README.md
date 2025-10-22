🧠 InterviewSim – Backend
📌 Descripción

Backend del sistema InterviewSim, encargado de generar preguntas de programación con inteligencia artificial (OpenAI), gestionar usuarios, y almacenar datos en MongoDB.

🚀 Tecnologías principales

Node.js + Express

MongoDB + Mongoose

OpenAI GPT-3.5 Turbo

Nodemailer

Zod, bcryptjs, dotenv, morgan

CORS y Helmet (seguridad)

⚙️ Instalación rápida
# Clonar o descomprimir el proyecto
cd InterviewSim-Backend

# Instalar dependencias
npm install

# Crear el archivo .env en la raíz

Ejemplo de .env:
RUNNING_BACKEND=8000
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/interviewsim
OPENAI_API_KEY=sk-<tu_api_key>
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contraseña
NODE_ENV=development

▶️ Ejecución
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start


Servidor por defecto en:
👉 http://localhost:8000

📂 Estructura básica
src/
├── index.js              # Entrada principal
├── app.js                # Configuración de Express
├── db.js                 # Conexión a MongoDB
├── routes/               # Definición de rutas
├── controllers/          # Lógica del sistema
├── models/               # Modelos Mongoose
├── middlewares/          # Autenticación y validación
└── IA/                   # Integración con OpenAI

🤖 Generación de preguntas con IA

El backend crea un prompt dinámico y lo envía al modelo gpt-3.5-turbo para obtener preguntas de programación tipo opción múltiple.

Ejemplo de prompt:

“Genera 5 preguntas de programación de nivel intermedio sobre Python en formato de opción múltiple (A, B, C, D), indicando la respuesta correcta y una breve explicación.”

Parámetros usados:

temperature: 0.7 → equilibrio entre creatividad y precisión

max_tokens: 1000

model: gpt-3.5-turbo

La respuesta se limpia y se guarda en MongoDB para ser mostrada en el frontend.

🧩 Autor
Nilson Andrés Cuero Ocoro
Sebastian Perez Bastidas
Proyecto académico: InterviewSim
Facultad de Ingeniería de Sistemas
