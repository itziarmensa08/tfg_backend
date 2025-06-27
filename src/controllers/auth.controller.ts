import { Request, Response } from "express";
import { forgotPassword, loginUser, registerUser, resendValidation, restorePassword, validateUser } from "../services/auth.service";
import fs from 'fs';
import path from 'path';
import { transporter } from "../config/mail";
import UserModel from "../models/user.model";
import logger from "../config/logger";

const registerCtrl = async ({ body }: Request, res: Response) => {
    try {
        const response = await registerUser(body);

        if (response === 'ARLEADY_USER') {
            logger.info(`Attempt to register existing user: ${body.username}`);
            res.status(409).send('Already user');

        } else if (response === 'USERNAME_NOT_AVAILABLE') {
            logger.info(`Username not available: ${body.username}`);
            res.status(409).send('Username not available');

        } else if (response === 'NOT_VALID_EMAIL') {
            logger.info(`Invalid email format: ${body.email}`);
            res.status(409).send('Email not valid');

        } else if (response === 'INVALID_PASSWORD') {
            logger.info(`Invalid password submitted by user: ${body.username}`);
            res.status(409).send('Invalid password');

        } else {
            res.status(201).send(response);
            logger.info(`User registered successfully: ${body.username}`);

            const user = await UserModel.findOne({ username: body.username });
            if (user != null) {
                const id = user._id.toString();
                const filePath = path.join(__dirname, '../templates/register.html');

                if (fs.existsSync(filePath)) {
                    let template = fs.readFileSync(filePath, 'utf-8');
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
                                logger.error(`Email sending failed for user ${body.username}: ${error}`);
                            } else {
                                logger.info(`Email sent to ${body.email}: ${info.response}`);
                            }
                        });
                    } catch (e: any) {
                        logger.error(`Exception sending email to ${body.email}: ${e.stack || e}`);
                    }
                } else {
                    logger.error(`register.html not found at path: ${filePath}`);
                }
            }
        }
    } catch (e: any) {
        logger.error(`Error in registerCtrl: ${e.stack || e}`);
        if (!res.headersSent) {
            res.status(500).send(`Error registerUser: ${e}`);
        } else {
            logger.error('Error occurred after headers sent:', e);
        }
    }
};

const loginCtrl = async (req: Request, res: Response) => {
    try {
        const response = await loginUser(req.body);

        if (response === 'NOT_FOUND_USER') {
            logger.error(`Login attempt failed: user not found (${req.body.username})`);
            res.status(404).send('Not found user');

        } else if (response === 'PASSWORD_INCORRECT') {
            logger.info(`Incorrect password for user: ${req.body.username}`);
            res.status(400).send('Incorrect password');

        } else if (response === 'NOT_VALIDATED') {
            logger.info(`Login failed, user not validated: ${req.body.username}`);
            res.status(401).send('User not validated');

        } else {
            logger.info(`User logged in: ${req.body.username}`);
            res.status(200).send(response);
        }
    } catch (e: any) {
        logger.error(`Error in loginCtrl: ${e.stack || e}`);
        res.status(500).send(`Error loginUser: ${e}`);
    }
};

const validateCtrl = async (req: Request, res: Response) => {
    try {
        const response = await validateUser(req.params.id);

        if (response === 'NOT_FOUND_USER') {
            logger.info(`Validation failed: user not found with id ${req.params.id}`);
            res.status(404).send('Not found user');
        } else {
            logger.info(`User validated: id ${req.params.id}`);
            res.status(200).send(response);
        }
    } catch (e: any) {
        logger.error(`Error in validateCtrl: ${e.stack || e}`);
        res.status(500).send(`Error validateUser: ${e}`);
    }
};

const resendCtrl = async ({ body }: Request, res: Response) => {
    try {
        const response = await resendValidation(body.username);

        if (response === 'EMAIL_SENT_SUCCESSFULLY') {
            logger.info(`Validation email resent to user: ${body.username}`);
            res.status(200).send('Email sent');

        } else if (response === 'NOT_FOUND_USER') {
            logger.info(`Resend email failed: user not found (${body.username})`);
            res.status(404).send('Not found user');

        } else {
            logger.error(`Unexpected response from resendValidation: ${response}`);
            res.status(500).send(response);
        }
    } catch (e: any) {
        logger.error(`Error in resendCtrl: ${e.stack || e}`);
        res.status(500).send(`Error resendEmail: ${e}`);
    }
};

const forgotCtrl = async ({ body }: Request, res: Response) => {
    try {
        const response = await forgotPassword(body.email);

        if (response === 'EMAIL_SENT_SUCCESSFULLY') {
            logger.info(`Password reset email sent to: ${body.email}`);
            res.status(200).send('Email sent');

        } else if (response === 'NOT_FOUND_USER') {
            logger.info(`Password reset failed: user not found (${body.email})`);
            res.status(404).send('Not found user');

        } else {
            logger.error(`Unexpected response from forgotPassword: ${response}`);
            res.status(500).send(response);
        }
    } catch (e: any) {
        logger.error(`Error in forgotCtrl: ${e.stack || e}`);
        res.status(500).send(`Error resendEmail: ${e}`);
    }
};

const restoreCtrl = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const pass = req.body.password;
        const response = await restorePassword(id, pass);

        if (response === 'PASSWORD_UPDATED_SUCCESSFULLY') {
            logger.info(`Password updated for user id: ${id}`);
            res.status(200).send('Password updated');

        } else if (response === 'USER_NOT_FOUND') {
            logger.info(`Restore password failed: user not found with id ${id}`);
            res.status(404).send('Not found user');

        } else {
            logger.error(`Unexpected response from restorePassword: ${response}`);
            res.status(500).send(response);
        }
    } catch (e: any) {
        logger.error(`Error in restoreCtrl: ${e.stack || e}`);
        res.status(500).send(`Error restorePass: ${e}`);
    }
};

export { registerCtrl, loginCtrl, validateCtrl, resendCtrl, forgotCtrl, restoreCtrl };