import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.handle";

const checkSession =  (req: Request, res: Response, next: NextFunction) => {
    try {
        const jwtBearer = req.headers.authorization || '';
        const jwt = jwtBearer.split(' ').pop();
        const userVerified = verifyToken(`${jwt}`);
        if (!userVerified) {
            res.status(401).send('Session not valid');
        } else {
            next();
        }
    } catch (e) {
        res.status(401).send(`Error verifying token: ${e}`);
    }
}

export { checkSession };