import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import usuario from "./routes/auth.routes.js";
import interview from "./routes/interwiew.routes.js";
import dotenv from "dotenv";
import compression from "compression";
import path from "path";

dotenv.config();

const app = express();
const isProduction = process.env.NODE_ENV === "production";
console.log("isProduction", isProduction);

// Middleware
app.use(compression());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// Configuración de CORS
const allowedOrigins = isProduction
  ? [
      "https://interviewsim-frontend.netlify.app", // ✅ Sin espacios
      "http://localhost:4000", // Desarrollo local
      "http://192.168.20.25:4000"
    ]
  : [
      "http://localhost:3000", // Desarrollo local con Create React App
      "http://localhost:4000",
      "http://192.168.20.25:4000"
    ];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Solicitud de origen:", origin);
      // Permitir solicitudes sin origen (como Postman, curl, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("Origen no permitido por CORS:", origin);
        callback(new Error(`Origen no permitido por CORS: ${origin}`));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: "InterviewSim Backend API",
    status: "OK",
    version: "1.0.0",
    endpoints: [
      "/api/login",
      "/api/register", 
      "/api/verify",
      "/interview/api/...",
    ],
    environment: process.env.NODE_ENV || "development"
  });
});

// Rutas
app.use("/api", usuario);
app.use("/interview", interview);

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Error interno del servidor",
  });
});

export default app;