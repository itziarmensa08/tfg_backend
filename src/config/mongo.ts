import "dotenv/config";
import { connect, ConnectOptions } from "mongoose";

export async function dbConnect(): Promise<void> {
    console.log('Connecting to mongo ...'); 
    const DB_URI = process.env.DB_URI || 'mongodb://mongo:27017/tfg-backend';
    console.log('DB_URI: ', DB_URI);
    if (!DB_URI) {
        console.error("DB_URI is not defined");
        process.exit(1);
    }
    try {
        await connect(DB_URI);
        console.log("Connected to MongoDB");
    } catch (e) {
        console.error('Connection Error:', e);
        //setTimeout(dbConnect, 5000);
    }
}

