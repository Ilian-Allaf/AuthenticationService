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
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = require("crypto");
const validator_1 = __importDefault(require("validator"));
const client = new client_1.PrismaClient();
function logIn(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        if (!email || !validator_1.default.isEmail(email)) {
            return res.status(422).json({ message: 'Invalid Email', field: 'email' });
        }
        try {
            const user = yield client.user.findUnique({
                where: {
                    email: email,
                }
            });
            if (!user || !user.password || !(yield bcrypt_1.default.compare(password, user.password))) {
                return res.status(422).json({ message: 'Wrong email or password' });
            }
            const sessionToken = yield createSession(user.id);
            yield client.$disconnect();
            return res.status(200).json({ message: 'Login successful', sessionToken: sessionToken });
        }
        catch (err) {
            yield client.$disconnect();
            console.error('Error executing query', err);
            return res.status(200).json({ message: 'Internal Server Error' });
        }
    });
}
exports.default = logIn;
function createSession(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = `${(0, crypto_1.randomUUID)()}${(0, crypto_1.randomUUID)()}`.replace(/-/g, '');
        try {
            yield client.session.create({
                data: {
                    userId: userId,
                    token: token,
                    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
                }
            });
            yield client.$disconnect();
        }
        catch (err) {
            yield client.$disconnect();
            console.error('Error executing query', err);
        }
        return token;
    });
}
