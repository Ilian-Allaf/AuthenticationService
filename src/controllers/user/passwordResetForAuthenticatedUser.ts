import { isPasswordValid } from '../../../utils/passwordCheck';
import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

export default async function passwordResetForAuthenticatedUser(req: Request, res: Response): Promise<Response> {
  const client = new PrismaClient();
  const { oldPassword,  newPassword} = req.body;

  const user = await client.user.findUnique({
    where: {
      id: req.session.user!.id
    }
  });

  if(!user){
    return res.status(422).json({ message: 'Invalid user' });
  };

  if (!user.password || !await bcrypt.compare(oldPassword, user.password)) {
    return res.status(422).json({ message: 'Wrong password' });
  }

  if(newPassword === oldPassword){
    return res.status(422).json({ message: 'New password cannot be the same as old password' });
  }

  if (!isPasswordValid(newPassword)) {
      return res.status(422).json({ message: 'Invalid input password', field: 'password' });
  }

  return res.status(200).json({ message: 'Successfully changed password !' });
}