import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error.middleware.js';
import { notFoundHandler } from './middleware/notFound.middleware.js';
import routes from './routes/index.js';

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../public');

export const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors());
app.use('/services', express.static(path.join(publicDir, 'services')));
app.use(express.json({ limit: '1mb' }));

if (env.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

app.use('/api/v1', routes);
app.use(notFoundHandler);
app.use(errorHandler);
