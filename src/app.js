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
const isProduction = process.env.NODE_ENV === "development";
console.log("isProduction", isProduction);

// Middleware
app.use(compression());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// Configuración de CORS
const allowedOrigins = isProduction
  ? ["http://localhost:4000" , 'http://192.168.20.25:4000']
  : ["https://proyecto-interviewsim.onrender.com", "https://poryectowwwinterviewsim-180808156072.us-central1.run.app"]

  app.use(
    cors({
      origin: (origin, callback) => {
        console.log("Solicitud de origen:", origin);
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          console.error("Origen no permitido por CORS:", origin);
          callback(new Error("Origen no permitido por CORS"));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

// Rutas
app.use("/api", usuario);
app.use("/interview", interview);

// Archivos estáticos (solo en producción)
if (isProduction) {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Error interno del servidor",
  });
});

export default app;
