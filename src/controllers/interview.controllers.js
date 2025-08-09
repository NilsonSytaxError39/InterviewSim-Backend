import Interview from '../models/interview.model.js';
import IA from '../IA/IA.js';
import User from '../models/user.model.js';
import Teacher from '../models/teacher.model.js';
import IARecomendacionEntrevista from '../IA/IARecomendacionEntrevista.js';
import IAInfo from '../IA/IAInfoTiempoReal.js';
import IARecomendacionesCalificacionesProgramacion from '../IA/IARecomendacionesCalificacionProgramacion.js';
import nodemailer from 'nodemailer';
import GenerarCalificacionesHTML from '../utils/generadorCalificaciones.js';

//enviar correo de calificaciones
export const enviarResultadosPorCorreo = async (email, calificacion, recomendacion) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const htmlContent = GenerarCalificacionesHTML(calificacion, recomendacion);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Resultados de tu prueba',
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo enviado con éxito');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};


//crear entrevista
export const createInterview = async (req, res) => {
    const { title, description, empresa, Dificultad, userId, tipoEntrevista, opciones, codigoBase } = req.body;

    const teacherId = req.userId || userId;
    if (!teacherId) {
        return res.status(400).json({ message: 'El ID del profesor es obligatorio.' });
    }

    try {
        const interviewData = {
            title,
            description,
            empresa,
            teacher: teacherId,
            Dificultad,
            tipoEntrevista,
        };

        if (tipoEntrevista === 'opcionMultiple') {
            interviewData.opciones = opciones;
        } else if (tipoEntrevista === 'programacion') {
            interviewData.codigoBase = codigoBase;
        }

        const newInterview = new Interview(interviewData);
        const interviewSaved = await newInterview.save();

        // Crear un mensaje detallado para la acción
        const actionMessage = `El profesor ha creado una nueva entrevista: "${title}" con una dificultad de "${Dificultad}" para la empresa "${empresa}".`;

        // Buscar al profesor y agregar la acción a su lista de acciones
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ message: 'Profesor no encontrado' });
        }
        teacher.accionesEntrevistasTeacher.push(actionMessage);
        await teacher.save();

        res.json(interviewSaved);
        console.log('Entrevista creada:', interviewSaved);
    } catch (error) {
        console.error('Error al crear entrevista:', error);
        res.status(500).json({ message: error.message });
    }
};


//traer todas las entrevistas
export const getInterviews = async (req, res) => {
    try {
        // Obtener los parámetros de consulta
        const { programming, difficulty } = req.query;

        // Crear un objeto de filtro dinámico
        const filter = {};
        if (programming) {
            filter.tipoEntrevista = programming; 
        }
        if (difficulty) {
            filter.Dificultad = difficulty; 
        }

        // Buscar entrevistas con los filtros aplicados
        const interviews = await Interview.find(filter);

        res.json(interviews);
    } catch (error) {
        console.error('Error al obtener entrevistas:', error);
        res.status(500).json({ message: error.message });
    }
};

//traer entrevista por id
export const getInterviewById = async (req, res) => {
    const interviewId = req.params.id;
    try {
        const interview = await Interview.findById(interviewId);
        if (!interview) {
            return res.status(404).json({ message: 'Entrevista no encontrada' });
        }
        const IAresult = await IA(interview);
        res.status(200).json({ interview, IAresult , tipoEntrevista: interview.tipoEntrevista }); 
    } catch (error) {
        console.error('Error al obtener entrevista por ID:', error);
        res.status(500).json({ message: error.message });
    }
};

//Traer entrevistas por profesor
export const getInterviewsByTeacher = async (req, res) => {
    const teacherId = req.params.id;
    try {
      const interviews = await Interview.find({ teacher: teacherId });
      res.json(interviews);
    } catch (error) {
      console.error('Error al obtener entrevistas por profesor:', error);
      res.status(500).json({ message: error.message });
    }
};


//Eliminar entrevista por id
export const deleteInterviewById = async (req, res) => {
    const interviewId = req.params.id;
    try {
        const interview = await Interview.findByIdAndDelete(interviewId);
        if (!interview) {
            return res.status(404).json({ message: 'Entrevista no encontrada' });
        }
        res.json({ message: 'Entrevista eliminada' });
    } catch (error) {
        console.error('Error al eliminar entrevista por ID:', error);
        res.status(500).json({ message: error.message });
    }
};


//Calificar entrevista
export const calificarEntrevista = async (req, res) => {
  const { respuestaIA, respuestaUser, userID, nombreEntrevista, dificultad, email } = req.body;

  // Inicializar el puntaje
  let score = 0;

  // Calcular el puntaje
  respuestaUser.forEach((respuesta, index) => {
    if (respuesta === respuestaIA[index]) {
      score++;
    }
  });

  // Crear descripción de la calificación
  const calificacionDescripcion = `Obtuviste ${score} de ${respuestaIA.length} en la entrevista "${nombreEntrevista}" con una dificultad de "${dificultad}". ¡Sigue así y continúa mejorando!`;

  try {
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Inicializar calificacionesEntrevistas si no está definido
    if (!user.calificacionesEntrevistas) {
      user.calificacionesEntrevistas = [];
    }

    // Agregar la nueva calificación
    user.calificacionesEntrevistas.push(calificacionDescripcion);
    await user.save();

    // Generar recomendaciones usando IA
    const recomendacionesRaw = await IARecomendacionEntrevista({
      Preguntas: respuestaIA,
      Respuestas: respuestaUser,
      RespuestasCorrectas: respuestaIA,
    });

    // Transformar las recomendaciones en un formato más claro
    const recomendaciones = recomendacionesRaw.recommendations.map((rec) => {
      return `Pregunta: ${rec.question} - Recomendación: ${rec.recommendation}`;
    });

    console.log('Recomendaciones procesadas:', recomendaciones);

    // Enviar resultados por correo
    await enviarResultadosPorCorreo(email, calificacionDescripcion, recomendaciones);

    // sumar numero de entrevistas hechas 
      await Interview.findOneAndUpdate(
        { title: nombreEntrevista }, 
        { $inc: { numeroEntrevistados: 1 } }
      );

    // Enviar respuesta al frontend
    
    res.status(200).json({
      message: "Calificación completada",
      score,
      total: respuestaIA.length,
      recomendaciones,
    });
  } catch (error) {
    console.error('Error al guardar la calificación:', error);
    res.status(500).json({ message: "Error al guardar la calificación" });
  }
};


// Obtener recomendaciones de la IA
export const obtenerRecomendaciones = async (req, res) => {
    const { preguntas, respuestaUser, respuestaIA } = req.body;
    try {
        const recomendaciones = await IARecomendacionEntrevista({
            Preguntas: preguntas,
            Respuestas: respuestaUser,
            RespuestasCorrectas: respuestaIA
        });
        res.status(200).json({ recomendaciones });
    } catch (error) {
        console.error('Error al obtener recomendaciones de la IA:', error);
        res.status(500).json({ message: "Error al obtener recomendaciones de la IA" });
    }
};

export const mostrarInfo = async (req, res) => {
    try {
        const info = await IAInfo();
        console.log("Respuesta de IAInfo:", JSON.stringify(info, null, 2));

        // Validar que la respuesta tenga la estructura esperada
        if (!info || !info.info || !Array.isArray(info.info.data)) {
            console.error("Respuesta de IAInfo no válida:", JSON.stringify(info, null, 2));
            return res.status(500).json({ message: "Formato incorrecto de la respuesta de la IA" });
        }

        // Ajustar la estructura para evitar la clave `info` duplicada
        res.status(200).json(info.info); // Enviar solo el contenido de `info`
    } catch (error) {
        console.error("Error al obtener información de la IA:", error);
        res.status(500).json({
            message: "Error al obtener información de la IA",
            error: error.message,
        });
    }
};

export const CalificacionRecomendacionProgramacion = async (req, res) => {
    console.log("Datos recibidos:", req.body); // Log para ver los datos

    const { pregunta, respuestaUser, respuestaEsperada } = req.body;

    try {
        // Validar que los parámetros necesarios estén presentes
        if (!pregunta || !respuestaUser || !respuestaEsperada) {
            return res.status(400).json({ message: "Faltan parámetros necesarios en la solicitud" });
        }

        // Llamar a la función que obtiene la calificación y recomendación
        const { calificacion, recomendacion } = await IARecomendacionesCalificacionesProgramacion({
            pregunta,
            respuestaUser,
            respuestaEsperada,
        });

        // Devolver tanto la calificación como la recomendación
        res.status(200).json({ calificacion, recomendacion });
    } catch (error) {
        console.error("Error en el punto de calificar y recomendar al usuario", error);
        res.status(500).json({ message: "Error en la respuesta de la IA" });
    }
};



