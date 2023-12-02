import { User } from "../interfaces/user.interface";
import UserModel from "../models/user";

const obtainUsers = async () => {
    const response = await UserModel.find({});
    return response;
}

const obtainUser = async (id: string) => {
    const response = await UserModel.findOne({_id: id});
    return response;
}

const putUser = async (id: string, user: User) => {
    const response = await UserModel.findOneAndUpdate({_id: id}, user, {new: true});
    return response;
}

const removeUser = async (id: string) => {
    const response = await UserModel.findByIdAndDelete({_id: id});
    return response;
}


export { obtainUsers, obtainUser, putUser, removeUser };