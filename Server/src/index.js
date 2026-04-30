import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { server } from './app.js'

dotenv.config({
    path: './.env'
})

connectDB()
.then(() => {
    server.listen(process.env.PORT || 8000, "0.0.0.0", () => {
         console.log(`Server is running on port ${process.env.PORT || 8000} and accessible on the local network`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})
