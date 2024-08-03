import { Request, Response } from "express";
import { loginUser, registerUser, validateUser } from "../services/auth.service";
import fs from 'fs';
import path from 'path';
import { transporter } from "../config/mail";
import UserModel from "../models/user.model";

const registerCtrl = async ({body}: Request, res: Response) => {
    try {
        const response = await registerUser(body);
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
            const user = await UserModel.findOne({username: body.username});
            if (user != null) {
                const id = user._id.toString();
                const filePath = path.join(__dirname, '../templates/register.html');
                if (fs.existsSync(filePath)) {
                    var template = fs.readFileSync(filePath, 'utf-8');
                    template = template.replace('{name}', body.name);
                    template = template.replace('{url}', `${process.env.FRONTEND_URL}#/login/${id}`);
                    const mailOptions = {
                        from: 'itziar.mensa08@gmail.com',
                        to: body.email,
                        subject: 'Confirmar email',
                        html: template,
                    };
                    try {
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log(`Email sent: ${info.response}`);
                            }
                        });
                    } catch (e) {
                        console.log(e);
                    }
                } else {
                    console.error(`Error: El archivo ${filePath} no existe.`);
                }
            }
        }
    } catch (e) {
        if (!res.headersSent) {
            res.status(500).send(`Error registerUser: ${e}`);
        } else {
            console.error('Error occurred after headers sent:', e);
        }
    }

}

const loginCtrl = async (req: Request, res: Response) => {
    try {
        const response = await loginUser(req.body);

        if (response == 'NOT_FOUND_USER') {
            res.status(404).send('Not found user');

        } else if (response == 'PASSWORD_INCORRECT') {
            res.status(400).send('Incorrect password');

        } else if (response == 'NOT_VALIDATED') {
            res.status(401).send('User not validated');

        } else {
            res.status(200).send(response);
        }
    } catch (e) {
        res.status(500).send(`Error loginUser: ${e}`);
    }
}

const validateCtrl = async (req: Request, res: Response) => {
    try {
        const response = await validateUser(req.params.id);

        if (response == 'NOT_FOUND_USER') {
            res.status(404).send('Not found user');
        } else {
            res.status(200).send(response);
        }
    } catch (e) {
        res.status(500).send(`Error validateUser: ${e}`);
    }
}

export { registerCtrl, loginCtrl, validateCtrl };