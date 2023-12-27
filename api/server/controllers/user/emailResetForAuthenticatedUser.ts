import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express';
import validator from 'validator';

export default async function emailResetForAuthenticatedUser(req: Request, res: Response): Promise<Response> {
    const client = new PrismaClient();
    const { email } = req.body;

    if(!email || !validator.isEmail(email)){
        return res.status(422).json({ message: 'Invalid Email', field: 'email' });
    }
    try{
        const user = await client.user.findUnique({
            where: {
                email: email,
            }
        });

        if(user){
            return res.status(409).json({ message: 'Email already taken', field: 'email' });
        }

        req.session.user!.email = email;

        await client.user.update({
            where: {
                id: req.session.user!.id,
            },
            data: {
                email: email,
            }
        });
        return res.status(200).json({ message: 'Successfully changed email !', user: req.session.user });
    }
    catch(err){
        await client.$disconnect()
        console.error('Error executing query', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}