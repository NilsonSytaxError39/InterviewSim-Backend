import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  try {
    // Intenta obtener el token de cookies
    const token = req.cookies.token;
    
    console.log("==================================");
    console.log("🔍 Middleware de autenticación ejecutado");
    console.log("Token recibido:", token ? "Sí" : "No");
    console.log("CLAVE_SECRETA en entorno:", process.env.CLAVE_SECRETA ? "SET" : "NOT SET");
    console.log("URL solicitada:", req.method, req.originalUrl);
    console.log("Headers:", req.headers);
    console.log("Cookies:", req.cookies);
    console.log("==================================");

    if (!token) {
      console.log("❌ No hay token en cookies");
      return res.status(401).json({ 
        message: "No token, authorization denied",
        error: true 
      });
    }

    // Verifica el token
    jwt.verify(token, process.env.CLAVE_SECRETA, (error, user) => {
      if (error) {
        console.log("❌ Error al verificar token:", error.message);
        console.log("❌ Token:", token);
        console.log("❌ CLAVE_SECRETA:", process.env.CLAVE_SECRETA);
        return res.status(401).json({ 
          message: "Token is not valid", 
          error: error.message,
          token: token.substring(0, 20) + "..." // Mostrar solo los primeros caracteres
        });
      }
      
      req.user = user;
      console.log("✅ Usuario autenticado:", user);
      console.log("✅ Rol del usuario:", user.role);
      console.log("✅ ID del usuario:", user.id);
      next();
    });
  } catch (error) {
    console.error("❌ Error en middleware auth:", error);
    return res.status(500).json({ message: error.message });
  }
};