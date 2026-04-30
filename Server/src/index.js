import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { server } from './app.js'

dotenv.config({
    path: './.env'
})

console.log("Starting server...");
console.log("Connecting to MongoDB...");

connectDB()
.then(() => {
    console.log("MongoDB connection successful!");
    const port = process.env.PORT || 8000;
    server.listen(port, "0.0.0.0", () => {
         console.log(`Server is running on port ${port} and accessible on the local network`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})
