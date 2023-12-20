import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { CookieOptions, Request, Response } from 'express';
import validator from 'validator';

const client = new PrismaClient();

export default async function logIn(req: Request, res: Response): Promise<Response> {
    const { email, password} = req.body;

    // if(!email || !validator.isEmail(email)){
    //     return res.status(422).json({ message: 'Invalid Email', field: 'email' });
    // }
    try {
        const user = await client.user.findUnique({
            where: {
              email: email,
            }
          });

        if (!user || !user.password || !await bcrypt.compare(password, user.password)) {
            return res.status(422).json({ message: 'Wrong email or password' });
        }

        const sessionToken = await createSession(user.id);
        await client.$disconnect()

        const cookieOptions: CookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'dev',
            sameSite: false,
            maxAge: 1000 * 60 * 60 * parseInt(process.env.SESSION_LIFE_TIME!),
            // domain: process.env.ALLOWED_ORIGIN,
            // path: '/',
        };

        res.cookie('sessionToken', sessionToken, cookieOptions);

        return res.status(200).json({ message: 'Login successful'});
        
    } 
    catch (err) {
        await client.$disconnect()
        console.error('Error executing query', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    };
}

async function createSession(userId: string): Promise<string> {
    const token = `${randomUUID()}${randomUUID()}`.replace(/-/g, '');

    try {
        await client.$transaction(
            async (tx) =>{
                await tx.session.deleteMany({
                    where: {
                        userId: userId,
                    },
                });
        
                await tx.session.create({
                    data: {
                        userId: userId,
                        token: token,
                    },
                });
            }
        );
        await client.$disconnect();

    } 
    catch (err) {
        await client.$disconnect();
        console.error('Error executing query', err);
    }
    return token;
}