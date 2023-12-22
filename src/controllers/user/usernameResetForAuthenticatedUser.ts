import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express';
import validator from 'validator';


export default async function usernameResetForAuthenticatedUser(req: Request, res: Response): Promise<Response> {
  const client = new PrismaClient();
  const { username } = req.body;
  if(!username || username.length > 20 || !validator.isAlphanumeric(username)){
    return res.status(422).json({ message: 'Invalid username', field: 'username' });
  }
  try{
    //check if username is already taken
    const user = await client.user.findUnique({
      where: {
        username: username,
      }
    });
    if(user){
      return res.status(409).json({ message: 'Username already taken', field: 'username' });
    }
    req.session.user!.username = username;
    //update username
    await client.user.update({
      where: {
        id: req.session.user!.id,
      },
      data: {
        username: username,
      }
    });
  }
  catch(err){
    await client.$disconnect()
    console.error('Error executing query', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
  return res.status(200).json({ message: 'Successfully reset password !', user: req.session.user });
}