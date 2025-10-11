import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  try {
    // Busca el token en cookies O en headers
    const { token: tokenFromCookie } = req.cookies;
    const tokenFromHeader = req.headers.authorization?.split(' ')[1]; // Bearer <token>
    
    const token = tokenFromCookie || tokenFromHeader;

    console.log("==================================");
    console.log("🔍 Middleware de autenticación ejecutado");
    console.log("Token desde cookie:", !!tokenFromCookie);
    console.log("Token desde header:", !!tokenFromHeader);
    console.log("Token total:", !!token);
    console.log("CLAVE_SECRETA:", process.env.CLAVE_SECRETA ? "SET" : "NOT SET");
    console.log("CLAVE_SECRETA length:", process.env.CLAVE_SECRETA ? process.env.CLAVE_SECRETA.length : "N/A");
    console.log("URL:", req.method, req.originalUrl);
    console.log("Headers:", Object.keys(req.headers));
    console.log("Cookies:", Object.keys(req.cookies || {}));
    console.log("==================================");

    if (!token) {
      console.log("❌ No hay token en cookies ni headers");
      return res.status(401).json({ 
        message: "No token, authorization denied",
        error: true 
      });
    }

    // Verifica el token
    jwt.verify(token, process.env.CLAVE_SECRETA, (error, user) => {
      if (error) {
        console.log("❌ Error al verificar token:");
        console.log("  - Error name:", error.name);
        console.log("  - Error message:", error.message);
        console.log("  - Error code:", error.code);
        console.log("  - Token:", token.substring(0, 20) + "...");
        console.log("  - CLAVE_SECRETA:", process.env.CLAVE_SECRETA);
        console.log("  - CLAVE_SECRETA length:", process.env.CLAVE_SECRETA ? process.env.CLAVE_SECRETA.length : "N/A");
        
        return res.status(401).json({ 
          message: "Token is not valid", 
          error: error.message,
          details: {
            name: error.name,
            message: error.message,
            code: error.code
          }
        });
      }
      
      req.user = user;
      console.log("✅ Token verificado exitosamente");
      console.log("  - Usuario ID:", user.id);
      console.log("  - Rol:", user.role);
      console.log("  - Fecha de emisión:", new Date(user.iat * 1000));
      console.log("  - Fecha de expiración:", new Date(user.exp * 1000));
      next();
    });
  } catch (error) {
    console.error("❌ Error en middleware auth:", error);
    return res.status(500).json({ message: error.message });
  }
};