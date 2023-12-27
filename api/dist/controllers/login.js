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
const redisClient_1 = require("../utils/redisClient");
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
            if (!user || !user.password || !(yield bcryptjs_1.default.compare(password, user.password))) {
                return res.status(422).json({ message: 'Wrong email or password' });
            }
            //S'il existe déja une session pour user.id dans la db redis on ne creer pas de nouvelle session
            if (yield redisClient_1.redisClient.exists(user.id)) {
                return res.status(200).json({ message: 'Already Logged-In', user: req.session.user });
            }
            req.session.regenerate((err) => {
                if (err) {
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
            });
            yield client.$disconnect();
            return res.status(200).json({ message: 'Login successful', user: req.session.user });
        }
        catch (err) {
            yield client.$disconnect();
            console.error('Error executing query', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        ;
    });
}
exports.default = logIn;
