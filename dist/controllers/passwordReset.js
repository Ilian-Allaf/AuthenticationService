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
const passwordCheck_1 = require("../utils/passwordCheck");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function handlePasswordReset(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new client_1.PrismaClient();
        const { token, password } = req.body;
        if (!token || !(0, passwordCheck_1.isPasswordValid)(password)) {
            return res.status(422).json({ message: 'Invalid input data' });
        }
        try {
            const passwordResetToken = yield client.passwordResetToken.findUnique({
                where: {
                    token,
                    resetAt: null,
                },
            });
            if (!passwordResetToken) {
                return res.status(422).json({ message: 'Invalid token reset request. Please try resetting your password again.' });
            }
            const user = yield client.user.findUnique({
                where: {
                    id: passwordResetToken.userId
                }
            });
            if (!user || (yield bcryptjs_1.default.compare(password, user.password))) {
                return res.status(422).json({ message: 'You cannot change for the same password' });
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            yield client.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                yield tx.user.update({
                    where: { id: passwordResetToken.userId },
                    data: {
                        password: hashedPassword,
                        emailVerified: true
                    },
                });
                yield tx.passwordResetToken.update({
                    where: {
                        id: passwordResetToken.id,
                    },
                    data: {
                        resetAt: new Date(),
                    },
                });
            }));
            yield client.$disconnect();
            return res.status(200).json({ message: 'Successfully updated the password !' });
        }
        catch (err) {
            console.error(err);
            yield client.$disconnect();
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    });
}
exports.default = handlePasswordReset;
