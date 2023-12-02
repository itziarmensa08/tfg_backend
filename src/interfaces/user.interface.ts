import { Auth } from "./auth.interface";

export interface User extends Auth {
    name: String;
    surname: String;
    role: 'admin' | 'user';
    telephone?: String;
    dateBorn?: Date;
}