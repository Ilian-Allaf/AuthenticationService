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
const node_schedule_1 = __importDefault(require("node-schedule"));
function executeSqlFunction() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new client_1.PrismaClient({ log: ['query', 'info', 'warn'], });
        try {
            const sessionLifeTime = process.env.SESSION_LIFE_TIME;
            // Validate SESSION_LIFE_TIME
            if (!sessionLifeTime || isNaN(Number(sessionLifeTime))) {
                throw new Error('Invalid SESSION_LIFE_TIME');
            }
            ;
            const intervalExpression = `INTERVAL '1 hour' - INTERVAL '${sessionLifeTime} hours'`;
            const result = yield client.$executeRawUnsafe(`DELETE FROM auth.session WHERE created_at < NOW() + ${intervalExpression};`);
            console.log('SQL Function executed successfully:', result);
            yield client.$disconnect();
        }
        catch (error) {
            yield client.$disconnect();
            console.error('Error executing SQL function:', error);
        }
        ;
    });
}
;
function startScheduler() {
    return __awaiter(this, void 0, void 0, function* () {
        node_schedule_1.default.scheduleJob('0 2 * * *', () => __awaiter(this, void 0, void 0, function* () {
            console.log('Executing scheduled job...');
            yield executeSqlFunction();
        }));
    });
}
exports.default = startScheduler;
;
