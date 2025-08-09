import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
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
    descriptionLaboral: {
      type: String,
      required: false,
    },
    calificacionesEntrevistas: {
      type: [String],
      required: false,
      default: [], 
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);