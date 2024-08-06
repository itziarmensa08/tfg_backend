import { Auth } from "./auth.interface";

export interface User extends Auth {
    name: String;
    surname: String;
    email: String;
    role: 'admin' | 'user';
    telephone?: String;
    dateBorn?: Date;
    profileImage?: String;
    language: 'ca' | 'es' | 'en_US';
    tasks: Event[];
}

export interface Event {
    date: Date;
    title: String;
    isCompleted: boolean;
    remembered: boolean;
}