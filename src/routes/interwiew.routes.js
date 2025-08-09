import { Router } from "express";
import {
 createInterview,getInterviews,getInterviewById,getInterviewsByTeacher,deleteInterviewById,calificarEntrevista,obtenerRecomendaciones,mostrarInfo,CalificacionRecomendacionProgramacion
} from "../controllers/interview.controllers.js";
import {auth} from '../middlewares/auth.middleware.js';

const router = Router();

router.post("/createInterview", auth,createInterview);
router.get("/interviews", auth, getInterviews);
router.get("/interview/:id",auth, getInterviewById);
router.get("/interviewTeacher/:id", auth,getInterviewsByTeacher);
router.delete("/deleteInterview/:id", auth,deleteInterviewById);
router.post("/calificar", auth,calificarEntrevista);
router.post("/recomendaciones", auth,obtenerRecomendaciones);
router.get("/Info", auth,mostrarInfo);
router.post("/Programacion" ,auth, CalificacionRecomendacionProgramacion)




export default router;