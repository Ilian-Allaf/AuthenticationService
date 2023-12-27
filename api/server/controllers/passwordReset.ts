import { isPasswordValid } from '../utils/passwordCheck';
import { Prisma, PrismaClient } from '@prisma/client'
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

export default async function handlePasswordReset(req: Request, res: Response): Promise<Response> {
  const client = new PrismaClient();
  const {token, password}  = req.body

    
  if (!token || !isPasswordValid(password)) {
      return res.status(422).json({ message: 'Invalid input data' });
  }

  try {
    const passwordResetToken = await client.passwordResetToken.findUnique({
        where: {
          token,
          resetAt: null,
        },
    });


    if (!passwordResetToken) {
        return res.status(422).json({ message: 'Invalid token reset request. Please try resetting your password again.' });
    }

    const user = await client.user.findUnique({
      where: {
        id: passwordResetToken.userId
      }
    });
    
    if(!user || await bcrypt.compare(password, user.password!)){
      return res.status(422).json({ message: 'You cannot change for the same password' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await client.$transaction(
      async (tx: Prisma.TransactionClient): Promise<void> => {
        await tx.user.update({
          where: { id: passwordResetToken.userId },
          data: {
            password: hashedPassword,
            emailVerified: true
          },
        });
  
        await tx.passwordResetToken.update({
          where: {
            id: passwordResetToken.id,
          },
          data: {
            resetAt: new Date(),
          },
        });
      }
    );
    
    await client.$disconnect()
    return res.status(200).json({ message: 'Successfully updated the password !' });

  } 
  catch (err) {
      console.error(err)
      await client.$disconnect()
      return res.status(500).json({ message: 'Internal Server Error' });
  }


}