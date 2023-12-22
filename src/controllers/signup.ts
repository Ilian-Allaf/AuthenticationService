import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import validator from 'validator';
import domains from 'disposable-email-domains';
import { isPasswordValid } from '../../utils/passwordCheck';
import { sendVerificationEmail } from '../../utils/sendEmail';

const client = new PrismaClient();

export default async function signUp(req: Request, res: Response): Promise<Response> {

  const { username, password, email } = req.body;
  const domain = email.split("@")[1];
  
  if (!username || !password || !email){
    return res.status(422).json({ message: 'You need to fill every fields', field: 'all' });
  }

  try {
    const existingUser = await client.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username },
        ],
      },
    });

    if (existingUser) {
      if(existingUser.email == email){
        return res.status(409).json({ message: 'Email already taken', field: 'email' });
      }

      if(existingUser.username == username){
        return res.status(409).json({ message: 'Username already taken', field: 'username' });
      }
    }

    if (!validator.isEmail(email) || domains.includes(domain) || email.includes('+') || email.lenght > 100){
      return res.status(422).json({ message: 'Invalid Email', field: 'email' });
    }
  
    if(!validator.isAlphanumeric(username) || username.lenght > 20) {
      return res.status(422).json({ message: 'Special characters are not allowed in username', field: 'username' });
    }
  
    if(!isPasswordValid(password)) {
      return res.status(422).json({ message: 'Password is too weak', field: 'password' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);


    await client.$transaction(
      async (tx) =>{
        const createdUser = await tx.user.create({
          data: {
            username: username,
            email: email,
            password: hashedPassword,
          },
        });

      await sendVerificationEmail({email: createdUser.email, userId: createdUser.id, client: tx});
      req.session.user = {
        id: createdUser.id,
        email: createdUser.email,
        username: createdUser.username,
        emailVerified: createdUser.emailVerified,
        role: createdUser.role,
      };
      }
    );

    await client.$disconnect()
    return res.status(200).json({ message: 'Sign-up successful', user: req.session.user });

  } 
  catch (error) {
    await client.$disconnect()
    console.error('Error during sign-up:', error);
    return res.status(500).json({ message: 'Internal Server Error. Try Again Later' });
  }
};