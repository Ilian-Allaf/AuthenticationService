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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const sendEmail_1 = require("../utils/sendEmail");
function resendVerificationEmail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new client_1.PrismaClient();
        const { sessionToken } = req.body;
        const sessionWithUser = yield client.session.findUnique({
            where: {
                token: sessionToken,
            },
            include: {
                user: true,
            },
        });
        if (!sessionWithUser) {
            yield client.$disconnect();
            return res.status(422).json({ message: 'Invalid session' });
        }
        const user = sessionWithUser.user;
        try {
            yield (0, sendEmail_1.sendVerificationEmail)({ email: user.email, userId: user.id, client: client });
            yield client.$disconnect();
            return res.status(200).json({ message: 'Successfully resent email !' });
        }
        catch (err) {
            yield client.$disconnect();
            return res.status(500).json({ message: 'Internal Server Error. Try Again Later' });
        }
    });
}
exports.default = resendVerificationEmail;
