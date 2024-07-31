import "dotenv/config";
import { connect, ConnectOptions } from "mongoose";

export async function dbConnect(): Promise<void> {
    const DB_URI = process.env.DB_URI || 'mongodb://mongo:27017/tfg-backend';
    console.log('DB_URI: ' + DB_URI);
    if (!DB_URI) {
        console.error("DB_URI is not defined");
        process.exit(1);
    }
    connect(DB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.error('Connection Error:', err);
        setTimeout(dbConnect, 5000);
    });
}

