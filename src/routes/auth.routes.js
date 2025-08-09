import { Router } from "express";
import {
  loginUserOrTeacher,
  logout,
  registerUserOrTeacher,
  verifyToken,
  DeleteUser,
  getGrades,
  getAccionTeacher,
  updateProfile,
  recoveryPassword,
  resetPassword
} from "../controllers/auth.controllers.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import { auth } from "../middlewares/auth.middleware.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" }); 

const router = Router();

router.post("/register", validateSchema(registerSchema), registerUserOrTeacher);
router.post("/login", validateSchema(loginSchema), loginUserOrTeacher);
router.get("/verify", verifyToken);
router.post("/logout", auth, logout);
router.delete("/deleteUser", auth, DeleteUser);
router.get("/getGrades", auth, getGrades);
router.get("/getGradesTeacher", auth, getAccionTeacher);

// Endpoint para actualizar el perfil con multer para manejar archivos
router.put("/updateProfile", auth, upload.single("photo"), updateProfile);
router.post("/recoveryPassword", recoveryPassword);
router.post("/resetPassword", resetPassword);

export default router;