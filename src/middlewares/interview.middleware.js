import jwt from "jsonwebtoken";

export const interviewAuth = (req, res, next) => {
  try {
    const { token } = req.cookies;

    console.log("Token recibido en interviewAuth:", token); // Para debugging

    if (!token) {
      console.log("No hay token en cookies");
      return res
        .status(401)
        .json({ message: "No token, authorization denied for interviews" });
    }

    jwt.verify(token, process.env.CLAVE_SECRETA, (error, user) => {
      if (error) {
        console.log("Token inválido para entrevistas:", error);
        return res.status(401).json({ message: "Token is not valid for interviews" });
      }
      req.user = user;
      console.log("Usuario autenticado para entrevistas:", user);
      next();
    });
  } catch (error) {
    console.error("Error en middleware interviewAuth:", error);
    return res.status(500).json({ message: error.message });
  }
};