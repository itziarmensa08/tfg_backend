import { Request, Response } from "express";
import { addTask, completeTask, obtainUser, obtainUsers, putUser, remindTask, removeUser } from "../services/user.service";
import fs from 'fs';
import path from 'path';
import UserModel from "../models/user.model";
import { transporter } from "../config/mail";
import logger from "../config/logger";

const getUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await obtainUser(id);
        logger.info(`User retrieved with id: ${id}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in getUser with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error getUser: ${e}`);
    }
};

const getUsers = async (_req: Request, res: Response) => {
    try {
        const response = await obtainUsers();
        logger.info("All users retrieved");
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in getUsers: ${e.stack || e}`);
        res.status(500).send(`Error getUsers: ${e}`);
    }
};

const updateUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const user = req.body;
        const response = await putUser(id, user);
        logger.info(`User updated with id ${id}: ${JSON.stringify(user)}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in updateUser with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error updateUser: ${e}`);
    }
};

const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await removeUser(id);
        logger.info(`User deleted with id: ${id}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in deleteUser with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error deleteUser: ${e}`);
    }
};

const addTaskUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const task = req.body;
        const response = await addTask(id, task);
        logger.info(`Task added to user ${id}: ${JSON.stringify(task)}`);
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
                    from: 'eosidcalculator@gmail.com',
                    to: `${user.email}`,
                    subject: 'Nueva tarea',
                    html: template,
                };
                try {
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            logger.error(`Error sending task email to ${user.email}: ${error}`);
                        } else {
                            logger.info(`Task email sent to ${user.email}: ${info.response}`);
                        }
                    });
                } catch (e: any) {
                    logger.error(`Exception sending task email: ${e.stack || e}`);
                }
            } else {
                logger.error(`Task email template not found: ${filePath}`);
            }
        }
    } catch (e: any) {
        logger.error(`Error in addTaskUser with id ${req.params.id}: ${e.stack || e}`);
        res.status(500).json(`Error adding task: ${e}`)
    }
}

const completeTaskUser = async (req: Request, res: Response) => {
    try {
        const idUser = req.params.idUser;
        const idTask = req.params.idTask;
        const response = await completeTask(idUser, idTask);
        logger.info(`Task ${idTask} completed by user ${idUser}`);
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in completeTaskUser with user ${req.params.idUser} and task ${req.params.idTask}: ${e.stack || e}`);
        res.status(500).json(`Error completing task: ${e}`);
    }
};

const sendRemindTask = async (_req: Request, res: Response) => {
    try {
        const response = await remindTask();
        logger.info("Reminder emails sent for pending tasks");
        res.status(200).send(response);
    } catch (e: any) {
        logger.error(`Error in sendRemindTask: ${e.stack || e}`);
        res.status(500).json(`Error sendReminders: ${e}`);
    }
};

export {getUser, getUsers, updateUser, deleteUser, addTaskUser, completeTaskUser, sendRemindTask};