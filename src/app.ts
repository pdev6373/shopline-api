import { config } from 'dotenv';
config();
import 'express-async-errors';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { connection } from 'mongoose';
import { logging } from './middlewares';
import { connectDatabase } from './configs';
import routes from './routes';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { swaggerDocs } from './configs';

logging.info('info');
logging.warn('warn');
logging.error('error');
logging.log('log or success');

const app: Express = express();
const PORT = process.env.PORT || 3500;

connectDatabase();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

connection.once('open', () => {
  app.listen(PORT, () => {
    app.use('/api/v1', routes());

    app.all('*', (req: Request, res: Response) => {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: ReasonPhrases.NOT_FOUND });
    });
  });

  swaggerDocs(app, Number(PORT));
});

connection.on('error', (err) => console.error(err));
