"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetPasswordEmail = exports.sendVerificationEmail = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const emailTemplates_1 = require("./emailTemplates");
const crypto_1 = require("crypto");
const client_1 = require("@prisma/client");
const client = new client_1.PrismaClient();
function sendEmail({ to, subject, html }) {
    return __awaiter(this, void 0, void 0, function* () {
        const transporter = nodemailer_1.default.createTransport({
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
            const info = yield transporter.sendMail(mailOptions);
            return info;
        }
        catch (error) {
            console.error('Erreur lors de l\'envoi de l\'e-mail: ', error);
            throw error;
        }
    });
}
exports.sendEmail = sendEmail;
function sendVerificationEmail({ email, userId }) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new client_1.PrismaClient();
        const token = yield client.verificationRequest.create({
            data: {
                userId: userId,
                token: `${(0, crypto_1.randomUUID)()}${(0, crypto_1.randomUUID)()}`.replace(/-/g, ''),
            },
        });
        const emailContent = (0, emailTemplates_1.baseTemplate)({
            title: 'Verify your email address',
            subtitle: 'To continue setting up your account, please verify that this is your email address.',
            buttonLink: `${process.env.NEXTAUTH_URL}/api/verify-email/${token.token}`,
            buttonText: 'Verify email address',
            additionalText: 'This link will expire in 5 days. if you did not make this request, please disregard this email.'
        });
        yield sendEmail({
            to: email,
            subject: "Verify your email address",
            html: emailContent,
        });
        yield client.$disconnect();
    });
}
exports.sendVerificationEmail = sendVerificationEmail;
function sendResetPasswordEmail({ email, userId }) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = yield client.passwordResetToken.create({
            data: {
                userId: userId,
                token: `${(0, crypto_1.randomUUID)()}${(0, crypto_1.randomUUID)()}`.replace(/-/g, ''),
            },
        });
        const emailContent = (0, emailTemplates_1.baseTemplate)({
            title: 'Reset password',
            subtitle: 'A password change has been requested for your account. If this was you, please use the link below to reset your password',
            buttonLink: `${process.env.NEXTAUTH_URL}/password-reset/${token.token}`,
            buttonText: 'Reset password',
            additionalText: ''
        });
        yield sendEmail({
            to: email,
            subject: "Reset password",
            html: emailContent,
        });
        yield client.$disconnect();
    });
}
exports.sendResetPasswordEmail = sendResetPasswordEmail;
