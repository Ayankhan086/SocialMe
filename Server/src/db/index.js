import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI ? process.env.MONGODB_URI.trim() : "";
        const connectionInstance = await mongoose.connect(uri, {
            dbName: DB_NAME // This ensures you use "SocialMe" as the database
        })
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) { 
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

export default connectDB
