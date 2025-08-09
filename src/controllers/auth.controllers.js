import User from '../models/user.model.js';
import Teacher from '../models/teacher.model.js';
import bcrypt from "bcryptjs";
import { createAccessToken } from '../libs/jwt.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';


// Función para registrar usuarios o profesores
export const registerUserOrTeacher = async (req, res) => {
  const { email, password, userName, role } = req.body;

  try {
    let existingUser;
    let Model;

    if (role === 'student') {
      Model = User;
    } else if (role === 'teacher') {
      Model = Teacher;
    } else {
      return res.status(400).json({ message: "Rol inválido" });
    }

    existingUser = await Model.findOne({ email });

    if (existingUser) {
      return res.status(401).json({ message: `El correo electrónico ya está en uso por otro ${role}` });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new Model({
      userName,
      email,
      password: passwordHash,
      role
    });

    const userSaved = await newUser.save();
    const token = await createAccessToken({ id: userSaved._id, role });
    res.cookie('token', token, { httpOnly: true, secure: true });
    res.json({
      id: userSaved._id,
      userName: userSaved.userName,
      email: userSaved.email,
      role: userSaved.role
    });
  } catch (error) {
    console.error('Error al registrar:', error);
    res.status(500).json({ message: error.message });
  }
};

// Función para iniciar sesión de usuarios o profesores
export const loginUserOrTeacher = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user;
    let Model;

    if (role === 'student') {
      Model = User;
    } else if (role === 'teacher') {
      Model = Teacher;
    } else {
      return res.status(400).json({ message: "Rol inválido" });
    }

    if (!email || !password) {
      return res.status(400).json({
        message: "Faltan credenciales: email o password",
        error: true,
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "La contraseña debe tener al menos 6 caracteres",
        error: true,
      });
    }

    user = await Model.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: `${role.charAt(0).toUpperCase() + role.slice(1)} no encontrado`,
        error: true,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Contraseña incorrecta",
        error: true,
      });
    }

    const token = jwt.sign({ id: user._id, role }, process.env.CLAVE_SECRETA, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true, secure: true });

    return res.json({
      error: false,
      message: "Inicio de sesión exitoso",
      id: user._id,
      userName: user.userName,
      email: user.email,
      date: user.createdAt,
      role: role,
      tokenSession: token,
    });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Función para cerrar sesión
export const logout = async (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: true,
  });
  return res.sendStatus(200);
};

// Función para obtener el perfil del usuario o profesor
export const profile = async (req, res) => {
  try {
    const { id, role } = req.user;

    let user;
    if (role === 'student') {
      user = await User.findById(id);
    } else if (role === 'teacher') {
      user = await Teacher.findById(id);
    }

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json({
      id: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Función para actualizar el perfil del usuario o profesor
export const updateProfile = async (req, res) => {
  const { id, role } = req.user;
  console.log("Datos recibidos en updateProfile:", req.body);
  const { userName, email, password } = req.body;
  try {
    if (!id || !role) {
      return res.status(400).json({ message: "ID o rol faltante" });
    }
    let user;
    let Model;
    if (role === 'student') {
      Model = User;
    } else if (role === 'teacher') {
      Model = Teacher;
    } else {
      return res.status(400).json({ message: "Rol inválido" });
    }
    user = await Model.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    // Actualizar nombre de usuario si viene en el body
    if (userName) {
      user.userName = userName;
    }
    // Validar y actualizar email según el modelo correspondiente
    if (email) {
      const existingUser = await Model.findOne({ email });
      if (existingUser && existingUser._id.toString() !== id) {
        return res.status(400).json({ message: "El correo electrónico ya está en uso" });
      }
      user.email = email;
    }
    // Actualizar contraseña si viene en el body
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });   
      }
      const passwordHash = await bcrypt.hash(password, 10);
      user.password = passwordHash;
    }
    // Si quieres manejar foto, aquí deberías agregar la lógica para guardar la imagen
    // if (req.file) { user.photo = ... }

    const updatedUser = await user.save();
    console.log("Usuario actualizado:", updatedUser);
    return res.json({
      error: false,
      id: updatedUser._id,
      userName: updatedUser.userName,
      email: updatedUser.email,
      role: updatedUser.role,
      message: "Perfil actualizado con éxito"
    });
    
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Función para verificar el token
export const verifyToken = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No hay token, no estás autorizado" });
    }

    jwt.verify(token, process.env.CLAVE_SECRETA, async (err, decoded) => {
      if (err) {
        return {
          message: "Token inválido",
          error: true,
        }
      }

      const { id, role } = decoded;
      let userFound;

      if (role === 'student') {
        userFound = await User.findById(id);
      } else if (role === 'teacher') {
        userFound = await Teacher.findById(id);
      }

      if (!userFound) {
        return res.status(403).json({ message: "Usuario no encontrado" });
      }

      return res.json({
        id: userFound._id,
        userName: userFound.userName,
        email: userFound.email,
        role
      });
    });
  } catch (error) {
    console.error('Error en la verificación del token:', error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Función para eliminar un usuario
export const DeleteUser = async (req, res) => {
  const { id, role } = req.user;
  try {
    if (!id || !role) {
      return res.status(400).json({ message: "ID o rol faltante" });
    }

    let Model;
    if (role === 'student') {
      Model = User;
    } else if (role === 'teacher') {
      Model = Teacher;
    } else {
      return res.status(400).json({ message: "Rol inválido" });
    }

    const user = await Model.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.cookie("token", "", {
      expires: new Date(0),
      httpOnly: true, // Asegúrate de que la cookie sea httpOnly
      secure: true,
    });

    console.log("Usuario eliminado:", user);
    return res.json({ message: "Usuario eliminado" });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Función para obtener las calificaciones de un usuario
export const getGrades = async (req, res) => {
  const { id, role } = req.user;
  try {
    if (!id || !role) {
      return res.status(400).json({ message: "ID o rol faltante" });
    }

    let Model;
    if (role === 'student') {
      Model = User;
    } else {
      return res.status(400).json({ message: "Rol inválido" });
    }

    const user = await Model.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const calificaciones = user.calificacionesEntrevistas || [];

    // Enviar las calificaciones de vuelta al frontend
    return res.status(200).json({ calificaciones });
  } catch (error) {
    console.error('Error al obtener las calificaciones:', error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Función para obtener las calificaciones de un profesor
export const getAccionTeacher = async (req, res) => {
  const { id, role } = req.user;
  try {
    if (!id || !role) {
      return res.status(400).json({ message: "ID o rol faltante" });
    }

    if (role !== 'teacher') {
      return res.status(400).json({ message: "Rol inválido" });
    }

    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: "Profesor no encontrado" });
    }

    const acciones = teacher.accionesEntrevistasTeacher || [];

    // Enviar las acciones de vuelta al frontend
    return res.status(200).json({ acciones });
  } catch (error) {
    console.error('Error al obtener las acciones:', error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

export const recoveryPassword = async (req, res) => {
  const { email, role } = req.body;

  console.log("Datos recibidos en recoveryPassword:", req.body);

  try {
    let Model;
    if (role === 'student') {
      Model = User;
    } else if (role === 'teacher') {
      Model = Teacher;
    } else {
      return res.status(400).json({ message: "Rol inválido" });
    }

    // Buscar el usuario por correo electrónico
    const user = await Model.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Crear un token de recuperación con una expiración corta
    const token = jwt.sign({ id: user._id, role }, process.env.CLAVE_SECRETA, { expiresIn: '15m' });

    // Configurar el transporte de nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    // Configurar el contenido del correo
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Recuperación de contraseña',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
            <h1 style="color: #283e56; text-align: center;">Recuperación de contraseña</h1>
            <p style="font-size: 16px; color: #333;">Hola <strong>${user.userName}</strong>,</p>
            <p style="font-size: 16px; color: #333;">Hemos recibido una solicitud para recuperar tu contraseña. Haz clic en el siguiente enlace para establecer una nueva contraseña:</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${process.env.FRONTEND_URL}/reset-password/${token}" target="_blank" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #283e56; text-decoration: none; border-radius: 5px;">Recuperar contraseña</a>
            </div>
            <p style="font-size: 14px; color: #666;">Este enlace expirará en 15 minutos.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #999; text-align: center;">Si no solicitaste esta acción, puedes ignorar este correo.</p>
          </div>
        `,
      };

    // Enviar el correo
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Correo de recuperación enviado con éxito" , error: false });
  } catch (error) {
    console.error('Error al enviar el correo de recuperación:', error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};


export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.CLAVE_SECRETA);

    const { id, role } = decoded;
    let Model;

    if (role === 'student') {
      Model = User;
    } else if (role === 'teacher') {
      Model = Teacher;
    } else {
      return res.status(400).json({ message: "Rol inválido" });
    }

    const user = await Model.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }

    // Actualizar la contraseña
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.password = passwordHash;
    await user.save();

    return res.status(200).json({ message: "Contraseña actualizada con éxito" , error: false });
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};