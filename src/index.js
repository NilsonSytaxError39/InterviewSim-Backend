import { connectDB } from "./db.js";
import app from "./app.js"; 

async function main() {
  try {
    await connectDB();
    app.listen(process.env.RUNNING_BACKEND, () => {
      console.log(`Listening on port ${process.env.RUNNING_BACKEND}`);
    });
  } catch (error) {
    console.error(error);
  }
}

main();