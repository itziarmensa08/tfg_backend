import { Auth } from "../interfaces/auth.interface";
import { User } from "../interfaces/user.interface";
import UserModel from "../models/user.model";
import { encrypt, verified } from "../utils/bcrypt.handle";
import { isEmail } from "../utils/email.handle";
import { generateToken } from "../utils/jwt.handle";

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

export { registerUser, loginUser, validateUser };