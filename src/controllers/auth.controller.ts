import { Request, Response } from "express";
import { forgotPassword, loginUser, registerUser, resendValidation, restorePassword, validateUser } from "../services/auth.service";
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
                    template = template.replace('{url}', `${process.env.FRONTEND_URL}/confirm?id=${id}`);
                    const mailOptions = {
                        from: 'eosidcalculator@gmail.com',
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

const resendCtrl = async ({body}: Request, res: Response) => {
    try {
        const response = await resendValidation(body.username);
        if (response == 'EMAIL_SENT_SUCCESSFULLY') {
            res.status(200).send('Email sent');
        } else if (response == 'NOT_FOUND_USER') {
            res.status(404).send('Not found user');
        } else {
            res.status(500).send(response);
        }
    } catch (e) {
        res.status(500).send(`Error resendEmail: ${e}`);
    }
}

const forgotCtrl = async ({body}: Request, res: Response) => {
    try {
        const response = await forgotPassword(body.email);
        if (response == 'EMAIL_SENT_SUCCESSFULLY') {
            res.status(200).send('Email sent');
        } else if (response == 'NOT_FOUND_USER') {
            res.status(404).send('Not found user');
        } else {
            res.status(500).send(response);
        }
    } catch (e) {
        res.status(500).send(`Error resendEmail: ${e}`);
    }
}

const restoreCtrl = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const pass = req.body.password;
        const response = await restorePassword(id, pass);
        if (response == 'PASSWORD_UPDATED_SUCCESSFULLY') {
            res.status(200).send('Password updated');
        } else if (response == 'USER_NOT_FOUND') {
            res.status(404).send('Not found user');
        } else {
            res.status(500).send(response);
        }
    } catch (e) {
        res.status(500).send(`Error restorePass: ${e}`);
    }
}

export { registerCtrl, loginCtrl, validateCtrl, resendCtrl, forgotCtrl, restoreCtrl };