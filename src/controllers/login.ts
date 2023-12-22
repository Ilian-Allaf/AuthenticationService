import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import validator from 'validator';
import { redisClient } from '../../utils/redisClient';
import Redis from 'ioredis';

const redis = new Redis();
const client = new PrismaClient()



export default async function logIn(req: Request, res: Response): Promise<Response> {
    const { email, password} = req.body;

    if(!email || !validator.isEmail(email)){
        return res.status(422).json({ message: 'Invalid Email', field: 'email' });
    }
    try {
        const user = await client.user.findUnique({
            where: {
              email: email,
            }
          });

        if (!user || !user.password || !await bcrypt.compare(password, user.password)) {
            return res.status(422).json({ message: 'Wrong email or password' });
        }
        //S'il existe déja une session pour user.id dans la db redis on ne creer pas de nouvelle session

        if(await redisClient.exists(user.id)){
            return res.status(200).json({ message: 'Already Logged-In', user: req.session.user});
        }
        
        req.session.regenerate((err) =>{
            if(err){
                console.error(err);
            }
            req.session.user = {
                id: user.id,
                email: user.email,
                username: user.username,
                emailVerified: user.emailVerified,
                role: user.role,
              };
            req.session.save();
        })

        await client.$disconnect()
        return res.status(200).json({ message: 'Login successful', user: req.session.user});
        
    } 
    catch (err) {
        await client.$disconnect()
        console.error('Error executing query', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    };
}