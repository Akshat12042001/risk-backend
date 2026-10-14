import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error.middleware.js';
import { notFoundHandler } from './middleware/notFound.middleware.js';
import routes from './routes/index.js';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));

if (env.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

app.use('/api/v1', routes);
app.use(notFoundHandler);
app.use(errorHandler);
