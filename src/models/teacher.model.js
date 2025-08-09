import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    accionesEntrevistasTeacher: {
      type: [String],
      required: false,
      default: [], 
    },
  },
  {
    timestamps: true, 
  }
);

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;