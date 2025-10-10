import { connectDB } from "./db.js";
import app from "./app.js"; 

async function main() {
  try {
    await connectDB();
    
    // Usa process.env.PORT para Render, sino RUNNING_BACKEND
    const PORT = process.env.PORT || process.env.RUNNING_BACKEND || 8000;
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1); // Termina el proceso si hay error
  }
}

main();