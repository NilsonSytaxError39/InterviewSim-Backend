import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    }, 
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    Dificultad: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    
    empresa:{
      type: String,
      required: true,
    },
    
    tipoEntrevista: {
      type: String,
      enum: ["opcionMultiple", "programacion"],
      required: true,
    },

    numeroEntrevistados: {
      type: Number,
      default: 0,
    },

  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;