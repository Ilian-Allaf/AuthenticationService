import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express';

export default async function logOut(req: Request, res: Response): Promise<Response>{
    req.session.destroy((err) => {
        if(err){
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    });
    return res.clearCookie(process.env.SESSION_NAME!, {domain: process.env.COOKIE_DOMAIN, path: process.env.COOKIE_PATH}).end();
}