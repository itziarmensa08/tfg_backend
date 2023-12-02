import { Auth } from "../interfaces/auth.interface";
import { User } from "../interfaces/user.interface";
import UserModel from "../models/user";
import { encrypt, verified } from "../utils/bcrypt.handle";
import { generateToken } from "../utils/jwt.handle";

const registerUser = async (user: User) => {
    const existingUser = await UserModel.findOne({ email: user.email });
    if (existingUser) return 'ARLEADY_USER';

    user.password = await encrypt(user.password);
    const register = await UserModel.create(user);
    return register;
}

const loginUser = async (auth: Auth) => {
    const existingUser = await UserModel.findOne({ email: auth.email });
    if (!existingUser) return 'NOT_FOUND_USER';

    const isCorrect = await verified(auth.password, existingUser.password);
    if(!isCorrect) return 'PASSWORD_INCORRECT';

    const token = generateToken(existingUser.email);
    const data = { token: token, user: existingUser};

    return data;
}

export { registerUser, loginUser };