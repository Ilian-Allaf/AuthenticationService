import { sendResetPasswordEmail } from '../utils/sendEmail';
import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express';
import validator from 'validator';

export default async function handleForgotPassword(req: Request, res: Response): Promise<Response> {
    const client = new PrismaClient();

    const { email }  = req.body
    if (!validator.isEmail(email)){
        return res.status(400).json({ message: 'Invalid email' });
    }

    try {
        const user = await client.user.findUnique({
            where: { email },
        })

        if (user) {
            await sendResetPasswordEmail({email: email, userId: user.id});
        }

        await client.$disconnect()
        return res.status(200).json({ message: 'Successfully sent email !' });

    } 
    catch (err) {
        await client.$disconnect()
        console.error('Error executing query', err);
        return res.status(500).json({ message: 'Internal Server Error. Try Again Later' });
    }
}