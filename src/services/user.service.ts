import { transporter } from "../config/mail";
import { User } from "../interfaces/user.interface";
import UserModel from "../models/user.model";
import fs from 'fs';
import path from 'path';

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

const addTask = async (id: string, task: Event) => {
    const updateResult = await UserModel.updateOne(
        { _id: id },
        { $push: { tasks: task  } }
    );
    return updateResult
}

const completeTask = async (userId: string, taskId: string): Promise<any> => {
    const updateResult = await UserModel.updateOne(
        { _id: userId, 'tasks._id': taskId },
        { $set: { 'tasks.$.isCompleted': true } }
    );

    return updateResult;
};

const remindTask = async () => {
    const users = await UserModel.find({});
    const now = new Date();

    for (let user of users) {
        const tasks = user.tasks;
        for (let task of tasks) {
            if (!task.isCompleted && !task.remembered) {
                const taskDate = new Date(task.date);
                const timeDifference = taskDate.getTime() - now.getTime();
                const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

                if (daysDifference <= 3) {
                    const filePath = path.join(__dirname, '../templates/reminderTask.html');
                    if (fs.existsSync(filePath)) {
                        var template = fs.readFileSync(filePath, 'utf-8');
                        template = template.replace('{name}', `${user.name}`);
                        template = template.replace('{url}', `${process.env.FRONTEND_URL}`);
                        template = template.replace('{title}', `${task.title}`);
                        let date = new Date(task.date);
                        let day = date.getUTCDate();
                        let month = date.getUTCMonth() + 1;
                        let year = date.getUTCFullYear();
                        let formattedDate = `${day}-${month}-${year}`;

                        template = template.replace('{date}', formattedDate);
                        const mailOptions = {
                            from: 'itziar.mensa08@gmail.com',
                            to: `${user.email}`,
                            subject: 'Nueva tarea',
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
                    task.remembered = true;
                }
            }
        }
        await user.save();
    }
}


export { obtainUsers, obtainUser, putUser, removeUser, addTask, completeTask, remindTask };