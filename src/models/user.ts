import {Schema, Types, model, Model} from "mongoose";
import { User } from "../interfaces/user.interface";

const UserSchema = new Schema<User> (
    {
        name: {
            type: String,
            required: true,
        },
        surname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user',
            required: true,
        },
        telephone: {
            type: Number,
        },
        dateBorn: {
            type: Date,
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const UserModel = model('users', UserSchema);

export default UserModel;