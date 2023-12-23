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
const validator_1 = __importDefault(require("validator"));
function emailResetForAuthenticatedUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new client_1.PrismaClient();
        const { email } = req.body;
        if (!email || !validator_1.default.isEmail(email)) {
            return res.status(422).json({ message: 'Invalid Email', field: 'email' });
        }
        try {
            const user = yield client.user.findUnique({
                where: {
                    email: email,
                }
            });
            if (user) {
                return res.status(409).json({ message: 'Email already taken', field: 'email' });
            }
            req.session.user.email = email;
            yield client.user.update({
                where: {
                    id: req.session.user.id,
                },
                data: {
                    email: email,
                }
            });
            return res.status(200).json({ message: 'Successfully changed email !', user: req.session.user });
        }
        catch (err) {
            yield client.$disconnect();
            console.error('Error executing query', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    });
}
exports.default = emailResetForAuthenticatedUser;
