import path from "path";
import { Auth } from "../interfaces/auth.interface";
import { User } from "../interfaces/user.interface";
import UserModel from "../models/user.model";
import { encrypt, verified } from "../utils/bcrypt.handle";
import { isEmail } from "../utils/email.handle";
import { generateToken } from "../utils/jwt.handle";
import fs from 'fs';
import { transporter } from "../config/mail";

const registerUser = async (user: User) => {
    if (isEmail(user.email.toString()) === false) return 'NOT_VALID_EMAIL';

    const existingUser = await UserModel.findOne({ email: user.email });
    if (existingUser) return 'ARLEADY_USER';

    const existingUser2 = await UserModel.findOne({ username: user.username });
    if (existingUser2) return 'USERNAME_NOT_AVAILABLE';

    if (user.password.length < 7) return 'INVALID_PASSWORD';

    user.password = await encrypt(user.password);
    const register = await UserModel.create(user);
    return register;
}

const loginUser = async (auth: Auth) => {
    const existingUser = await UserModel.findOne({ username: auth.username });
    if (!existingUser) return 'NOT_FOUND_USER';

    const isCorrect = await verified(auth.password, existingUser.password);
    if(!isCorrect) return 'PASSWORD_INCORRECT';

    const isValidated = existingUser.validated;
    if (!isValidated) return 'NOT_VALIDATED'

    const token = generateToken(existingUser.username);
    const data = { token: token, user: existingUser};

    return data;
}

const validateUser = async (id: string) => {
    const existingUser = await UserModel.findOne({ _id: id });
    if (!existingUser) return 'NOT_FOUND_USER';

    const response = await UserModel.findOneAndUpdate(
        { _id: id },
        { $set: { validated: true } },
        { new: true }
    );
    return response;
};

const resendValidation = async (username: string) => {
    try {
        const existingUser = await UserModel.findOne({ username: username });
        if (!existingUser) {
            return 'NOT_FOUND_USER';
        }

        const id = existingUser._id.toString();
        const filePath = path.join(__dirname, '../templates/register.html');

        if (!fs.existsSync(filePath)) {
            console.error(`Error: El archivo ${filePath} no existe.`);
            return 'FILE_NOT_FOUND';
        }

        let template = fs.readFileSync(filePath, 'utf-8');
        template = template.replace('{name}', String(existingUser.name));
        template = template.replace('{url}', `${process.env.FRONTEND_URL}/confirm?id=${id}`);

        const mailOptions = {
            from: 'eosidcalculator@gmail.com',
            to: String(existingUser.email),
            subject: 'Confirmar email',
            html: template,
        };

        await transporter.sendMail(mailOptions);
        return 'EMAIL_SENT_SUCCESSFULLY';
    } catch (error) {
        console.error('Error sending email:', error);
        return 'EMAIL_SEND_FAILED';
    }
};

const forgotPassword = async (email: string) => {
    try {
        const existingUser = await UserModel.findOne({ email: email });
        if (!existingUser) {
            return 'NOT_FOUND_USER';
        }

        const id = existingUser._id.toString();
        const filePath = path.join(__dirname, '../templates/forgotPass.html');

        if (!fs.existsSync(filePath)) {
            console.error(`Error: El archivo ${filePath} no existe.`);
            return 'FILE_NOT_FOUND';
        }

        let template = fs.readFileSync(filePath, 'utf-8');
        template = template.replace('{name}', String(existingUser.name));
        template = template.replace('{url}', `${process.env.FRONTEND_URL}/restorePass?id=${id}`);

        const mailOptions = {
            from: 'eosidcalculator@gmail.com',
            to: String(existingUser.email),
            subject: 'Restaurar cuenta',
            html: template,
        };

        await transporter.sendMail(mailOptions);
        return 'EMAIL_SENT_SUCCESSFULLY';
    } catch (error) {
        console.error('Error sending email:', error);
        return 'EMAIL_SEND_FAILED';
    }
};

const restorePassword = async (id: string, pass: string): Promise<string> => {
    try {
        const encryptedPass = await encrypt(pass);
        
        const updatedUser = await UserModel.findOneAndUpdate(
            { _id: id },
            { password: encryptedPass },
            { new: true }
        );

        if (!updatedUser) {
            return 'USER_NOT_FOUND';
        }

        return 'PASSWORD_UPDATED_SUCCESSFULLY';
    } catch (error) {
        console.error('Error updating password:', error);
        return 'ERROR_RESTORE';
    }
};

export { registerUser, loginUser, validateUser, resendValidation, forgotPassword, restorePassword };