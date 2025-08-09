import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB is connected");
  } catch (error) {
    console.error(error);
  }
};

// Iniciar el servicio de MongoDB
// sudo systemctl start mongod 
// sudo systemctl status mongod 