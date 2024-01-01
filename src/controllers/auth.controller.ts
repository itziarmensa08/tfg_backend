import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.service";

const registerCtrl = async (req: Request, res: Response) => {
    try {
        const response = await registerUser(req.body);
        if (response == 'ARLEADY_USER') {
            res.status(409).send('Already user');
        } else if(response == 'USERNAME_NOT_AVAILABLE') {
            res.status(409).send('Username not available');
        } else if(response == 'NOT_VALID_EMAIL') {
            res.status(409).send('Email not valid');
        } else if(response == 'INVALID_PASSWORD') {
            res.status(409).send('Invalid password');
        } else {
            res.status(201).send(response);
        }
    } catch (e) {
        res.status(500).send(`Error registerUser: ${e}`);
    }

}

const loginCtrl = async (req: Request, res: Response) => {
    try {
        const response = await loginUser(req.body);

        if (response == 'NOT_FOUND_USER') {
            res.status(404).send('Not found user');

        } else if (response == 'PASSWORD_INCORRECT') {
            res.status(400).send('Incorrect password');

        } else {
            res.status(200).send(response);
        }
    } catch (e) {
        res.status(500).send(`Error registerUser: ${e}`);
    }
}

export { registerCtrl, loginCtrl };