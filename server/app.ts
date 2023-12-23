import express, { NextFunction } from 'express';
import router from './routes/service';
import bodyParser from 'body-parser';
import cors from 'cors';
import startScheduler from './scheduler';
import helmet, { xPoweredBy } from 'helmet';
import csp from 'helmet-csp';
import session from 'express-session';
import RedisStore from "connect-redis"
import { redisClient } from './utils/redisClient';
import uuid from 'node-uuid';
import http from 'http';
import { body, validationResult } from 'express-validator';

declare module "express-session" {
  interface SessionData {
    user?:{
      id: string;
      email: string;
      username: string;
      emailVerified: boolean;
      role: string;
    }
  }
}

const store = new RedisStore({
  client: redisClient,
});

const app = express();
app.use(helmet());
app.disable("x-powered-by");
app.disable("etag");

const port = process.env.PORT;

app.use(session({
  genid:function () {return uuid.v4();},
  name: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET!,
  store: store,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV !== 'dev',
    maxAge: 1000 * 60 * 60 * parseInt(process.env.SESSION_LIFE_TIME!),
    sameSite: true,
    domain: process.env.COOKIE_DOMAIN,
    path: process.env.COOKIE_PATH,
  }
}));

const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(bodyParser.json());
app.use(helmet());
app.use(helmet.hsts({maxAge: 5184000}));
app.use(helmet.hidePoweredBy())
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(csp({
  directives: {
    defaultSrc: ["'self'", 'another-site.com'],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ['img.com', 'data:'],
    sandbox: ['allow-forms', 'allow-scripts'],
    reportUri: '/report-violation',
    upgradeInsecureRequests: [],  }
}));


app.use('/', router);

app.listen(port, () => console.log(`Listening on port ${port}`));
