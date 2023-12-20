import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express';
import { sendVerificationEmail } from '../../utils/sendEmail';

export default async function resendVerificationEmail(req: Request, res: Response): Promise<Response> {
    const client = new PrismaClient();
    const { sessionToken } = req.body;
    const sessionWithUser = await client.session.findUnique({
        where: {
            token: sessionToken,
        },
        include: {
            user: true,
        },
    });

    if (!sessionWithUser) {
        await client.$disconnect()
        return res.status(422).json({ message: 'Invalid session' });
    }

    const user = sessionWithUser.user;
    try{
        await sendVerificationEmail({email: user.email, userId: user.id});
        await client.$disconnect()
        return res.status(200).json({ message: 'Successfully resent email !' });

    }
    catch(err){
        await client.$disconnect()
        return res.status(500).json({ message: 'Internal Server Error. Try Again Later' });
    }
}