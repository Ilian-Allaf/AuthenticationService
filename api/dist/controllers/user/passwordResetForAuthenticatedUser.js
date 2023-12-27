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
const passwordCheck_1 = require("../../utils/passwordCheck");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function passwordResetForAuthenticatedUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new client_1.PrismaClient();
        const { oldPassword, newPassword } = req.body;
        const user = yield client.user.findUnique({
            where: {
                id: req.session.user.id
            }
        });
        if (!user) {
            return res.status(422).json({ message: 'Invalid user' });
        }
        ;
        if (!user.password || !(yield bcryptjs_1.default.compare(oldPassword, user.password))) {
            return res.status(422).json({ message: 'Wrong password' });
        }
        if (newPassword === oldPassword) {
            return res.status(422).json({ message: 'New password cannot be the same as old password' });
        }
        if (!(0, passwordCheck_1.isPasswordValid)(newPassword)) {
            return res.status(422).json({ message: 'Invalid input password', field: 'password' });
        }
        return res.status(200).json({ message: 'Successfully changed password !' });
    });
}
exports.default = passwordResetForAuthenticatedUser;
