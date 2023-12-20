import express from 'express';
import router from './routes/service';
import bodyParser from 'body-parser';
import cors from 'cors';
import startScheduler from './scheduler';
import helmet from 'helmet';
import csp from 'helmet-csp';
import express_enforces_ssl from 'express-enforces-ssl';

const app = express();

const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(express_enforces_ssl());
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





const port = process.env.PORT;

app.use('/', router);
app.listen(port, () => console.log(`Listening on port ${port}`));
startScheduler();
