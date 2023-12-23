import nodemailer from 'nodemailer';
import { baseTemplate } from './emailTemplates';
import { randomUUID } from 'crypto';
import { PrismaClient, Prisma } from '@prisma/client'
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const client = new PrismaClient();

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }): Promise<SMTPTransport.SentMessageInfo> {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_SERVER_HOST,
      port: Number(process.env.MAIL_SERVER_PORT),
      ignoreTLS: true,
    });
  
    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: to,
      subject: subject,
      html: html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        return info;
    } 
    catch (error) {
        throw error;
    }
    
}

export async function sendVerificationEmail({email, userId, client}:{email: string, userId: string, client: Prisma.TransactionClient | PrismaClient}): Promise<void> {
  try {
        await client.verificationRequest.deleteMany({
          where: {
            userId: userId,
          },
        });
      
        const token = await client.verificationRequest.create({
          data: {
            userId: userId,
            token: `${randomUUID()}${randomUUID()}`.replace(/-/g, ''),
          },
        });
      
        const emailContent = baseTemplate({
          title: 'Verify your email address',
          subtitle: 'To continue setting up your account, please verify that this is your email address.',
          buttonLink: `${process.env.NEXTAUTH_URL}/api/verify-email/${token.token}`,
          buttonText: 'Verify email address',
          additionalText: 'This link will expire in 5 days. if you did not make this request, please disregard this email.'
        });
      
        await sendEmail({
            to: email,
            subject: "Verify your email address",
            html: emailContent,
          });
  }catch(err){
    throw err
  }
  
};

export async function sendResetPasswordEmail({email, userId}:{email: string, userId: string}){
  try {
    await client.$transaction(
      async (tx: Prisma.TransactionClient): Promise<void> =>{
        await tx.passwordResetToken.deleteMany({
          where: {
            userId: userId,
          },
        });
        
        const token =  await tx.passwordResetToken.create({
            data: {
              userId: userId,
              token: `${randomUUID()}${randomUUID()}`.replace(/-/g, ''),
            },
          });

        const emailContent = baseTemplate({
          title: 'Reset password',
          subtitle: 'A password change has been requested for your account. If this was you, please use the link below to reset your password',
          buttonLink: `${process.env.NEXTAUTH_URL}/password-reset/${token.token}`,
          buttonText: 'Reset password',
          additionalText: ''
        });
        
        await sendEmail({
          to: email,
          subject: "Reset password",
          html: emailContent,
        });
      },
      {
        maxWait: 5000, // default: 2000
        timeout: 10000, // default: 5000
      }
    );
    await client.$disconnect()

  } catch (err) {
    await client.$disconnect()
    throw err
  }
  
}