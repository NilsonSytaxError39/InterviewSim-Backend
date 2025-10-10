import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  try {
    const { token } = req.cookies;

    console.log("Token recibido en middleware:", token); // Para debugging

    if (!token) {
      console.log("No hay token en cookies");
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    jwt.verify(token, process.env.CLAVE_SECRETA, (error, user) => {
      if (error) {
        console.log("Token inválido:", error);
        return res.status(401).json({ message: "Token is not valid" });
      }
      req.user = user;
      console.log("Usuario autenticado:", user);
      next();
    });
  } catch (error) {
    console.error("Error en middleware auth:", error);
    return res.status(500).json({ message: error.message });
  }
};