import "dotenv/config";
import { connect } from "mongoose";

export async function dbConnect(): Promise<void> {
    const DB_URI = process.env.DB_URI || 'mongodb://mongo:27017/tfg-backend';
    console.log('DB_URI: ' + DB_URI);
    if (!DB_URI) {
        console.error("DB_URI is not defined");
        process.exit(1);
    }
    try {
        await connect(DB_URI);
        console.log("Connection Ready");
    } catch (error) {
        console.error("Connection Error:", error);
        process.exit(1);
    }
}
