import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express';

const client = new PrismaClient();

export default async function logOut(req: Request, res: Response): Promise<Response>{
    const sessionToken = req.body.sessionToken;
    try {
        await client.session.delete({
            where: {
                token: sessionToken.id,
            }
        });
        await client.$disconnect()
        return res.status(200).json({ message: 'Logout successful' });
        
    } 
    catch (err) {
        await client.$disconnect()
        console.error('Error executing query', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}