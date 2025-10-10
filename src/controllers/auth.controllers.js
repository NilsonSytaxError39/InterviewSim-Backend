// Función para registrar usuarios o Entrevistadores
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
    
    // ✅ Cambiado: Usa la misma clave secreta que login
    const token = jwt.sign({ id: userSaved._id, role }, process.env.CLAVE_SECRETA, { expiresIn: "7d" });
    
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