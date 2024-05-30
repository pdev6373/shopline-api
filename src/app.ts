import { config } from 'dotenv';
config();
import 'express-async-errors';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { connection } from 'mongoose';
import { logging } from './middlewares';
import { corsOptions, connectDatabase } from './configs';
import routes from './routes';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

logging.info('info');
logging.warn('warn');
logging.error('error');
logging.log('log or success');

const app: Express = express();
const PORT = process.env.PORT || 3500;

connectDatabase();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use('/api/v1', routes());

app.all('*', (req: Request, res: Response) => {
  res
    .status(StatusCodes.NOT_FOUND)
    .json({ success: false, message: ReasonPhrases.NOT_FOUND });
});

app.get('/', (req: Request, res: Response) => {
  const {} = req;
  res.send('Express + TypeScript Server');
});

connection.once('open', () => {
  app.listen(PORT, () =>
    console.log(`[server]: Server is running on port: ${PORT}`),
  );
});

connection.on('error', (err) => console.error(err));
