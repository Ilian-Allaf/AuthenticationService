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
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const validator_1 = __importDefault(require("validator"));
const disposable_email_domains_1 = __importDefault(require("disposable-email-domains"));
const passwordCheck_1 = require("../utils/passwordCheck");
const sendEmail_1 = require("../utils/sendEmail");
const client = new client_1.PrismaClient();
function signUp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password, email } = req.body;
        const domain = email.split("@")[1];
        if (!username || !password || !email) {
            return res.status(422).json({ message: 'You need to fill every fields', field: 'all' });
        }
        try {
            const existingUser = yield client.user.findFirst({
                where: {
                    OR: [
                        { email: email },
                        { username: username },
                    ],
                },
            });
            if (existingUser) {
                if (existingUser.email == email) {
                    return res.status(409).json({ message: 'Email already taken', field: 'email' });
                }
                if (existingUser.username == username) {
                    return res.status(409).json({ message: 'Username already taken', field: 'username' });
                }
            }
            if (!validator_1.default.isEmail(email) || disposable_email_domains_1.default.includes(domain) || email.includes('+') || email.lenght > 100) {
                return res.status(422).json({ message: 'Invalid Email', field: 'email' });
            }
            if (!validator_1.default.isAlphanumeric(username) || username.lenght > 20) {
                return res.status(422).json({ message: 'Special characters are not allowed in username', field: 'username' });
            }
            if (!(0, passwordCheck_1.isPasswordValid)(password)) {
                return res.status(422).json({ message: 'Password is too weak', field: 'password' });
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            yield client.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const createdUser = yield tx.user.create({
                    data: {
                        username: username,
                        email: email,
                        password: hashedPassword,
                    },
                });
                yield (0, sendEmail_1.sendVerificationEmail)({ email: createdUser.email, userId: createdUser.id, client: tx });
                req.session.user = {
                    id: createdUser.id,
                    email: createdUser.email,
                    username: createdUser.username,
                    emailVerified: createdUser.emailVerified,
                    role: createdUser.role,
                };
            }));
            yield client.$disconnect();
            return res.status(200).json({ message: 'Sign-up successful', user: req.session.user });
        }
        catch (error) {
            yield client.$disconnect();
            console.error('Error during sign-up:', error);
            return res.status(500).json({ message: 'Internal Server Error. Try Again Later' });
        }
    });
}
exports.default = signUp;
;
