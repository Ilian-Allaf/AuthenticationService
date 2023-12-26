"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const service_1 = __importDefault(require("./routes/service"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const helmet_csp_1 = __importDefault(require("helmet-csp"));
const express_session_1 = __importDefault(require("express-session"));
// import RedisStore from "connect-redis"
// import { redisClient } from './utils/redisClient';
const node_uuid_1 = __importDefault(require("node-uuid"));
// const store = new RedisStore({
//   client: redisClient,
// });
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.disable("x-powered-by");
app.disable("etag");
const port = process.env.PORT;
app.use((0, express_session_1.default)({
    genid: function () { return node_uuid_1.default.v4(); },
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    // store: store,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV !== 'dev',
        maxAge: 1000 * 60 * 60 * parseInt(process.env.SESSION_LIFE_TIME),
        sameSite: true,
        domain: process.env.COOKIE_DOMAIN,
        path: process.env.COOKIE_PATH,
    }
}));
const corsOptions = {
    origin: process.env.ALLOWED_ORIGIN,
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.hsts({ maxAge: 5184000 }));
app.use(helmet_1.default.hidePoweredBy());
app.use(helmet_1.default.frameguard({ action: 'deny' }));
app.use(helmet_1.default.xssFilter());
app.use(helmet_1.default.noSniff());
app.use((0, helmet_csp_1.default)({
    directives: {
        defaultSrc: ["'self'", 'another-site.com'],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ['img.com', 'data:'],
        sandbox: ['allow-forms', 'allow-scripts'],
        reportUri: '/report-violation',
        upgradeInsecureRequests: [],
    }
}));
app.use('/', service_1.default);
app.listen(port, () => console.log(`Listening on port ${port}`));
