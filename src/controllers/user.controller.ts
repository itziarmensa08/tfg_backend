import { Request, Response } from "express";
import { addTask, completeTask, obtainUser, obtainUsers, putUser, remindTask, removeUser } from "../services/user.service";
import fs from 'fs';
import path from 'path';
import UserModel from "../models/user.model";
import { transporter } from "../config/mail";

const getUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await obtainUser(id);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error getUser: ${e}`)
    }
}

const getUsers = async (req: Request, res: Response) => {
    try {
        const response = await obtainUsers();
        res.status(200).send(response);
    } catch (e) {
        res.status(500).send(`Error getUsers: ${e}`)
    }
}

const updateUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const user = req.body;
        const response = await putUser(id, user);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error updateUser: ${e}`)
    }
}

const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await removeUser(id);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error deleteUser: ${e}`)
    }
}

const addTaskUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const task = req.body;
        const response = await addTask(id, task);
        res.status(200).send(response);
        const user = await UserModel.findOne({_id: id});
        if (user != null) {
            const filePath = path.join(__dirname, '../templates/newTask.html');
            if (fs.existsSync(filePath)) {
                var template = fs.readFileSync(filePath, 'utf-8');
                template = template.replace('{name}', `${user.name}`);
                template = template.replace('{url}', `${process.env.FRONTEND_URL}`);
                template = template.replace('{title}', task.title);
                let date = new Date(task.date);
                let day = date.getUTCDate();
                let month = date.getUTCMonth() + 1;
                let year = date.getUTCFullYear();
                let formattedDate = `${day}-${month}-${year}`;

                template = template.replace('{date}', formattedDate);
                const mailOptions = {
                    from: 'h24@flightlinebcn.com',
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
        }
    } catch (e) {
        res.status(500).json(`Error adding task: ${e}`)
    }
}

const completeTaskUser = async (req: Request, res: Response) => {
    try {
        const idUser = req.params.idUser;
        const idTask = req.params.idTask;
        const response = await completeTask(idUser, idTask);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error completing task: ${e}`)
    }
}

const sendRemindTask = async (req: Request, res: Response) => {
    try {
        const response = await remindTask();
        res.status(200).send(response);
    } catch (e) {
        res.status(500).json(`Error sendReminders: ${e}`)
    }
}

export {getUser, getUsers, updateUser, deleteUser, addTaskUser, completeTaskUser, sendRemindTask};