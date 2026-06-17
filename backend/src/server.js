import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { authRouter } from './routes/auth.routes.js';
import { bankRouter } from './routes/bank.routes.js';
import { charactersRouter } from './routes/characters.routes.js';
import { config } from './config.js';
import { createCoreRouter } from './routes/core.routes.js';
import { connectMongo } from './db/mongo.js';
import { seedMongo } from './db/seed.js';
import { economyRouter } from './routes/economy.routes.js';
import { healthRouter } from './routes/health.routes.js';
import { jobsRouter } from './routes/jobs.routes.js';
import { mapRouter } from './routes/map.routes.js';
import { worldRouter } from './routes/world.routes.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin: config.corsOrigin === '*' ? true : config.corsOrigin.split(',').map((origin) => origin.trim())
}));
app.use(express.json());
app.use(morgan('dev'));

app.use('/health', healthRouter);
app.use('/auth', authRouter);
app.use('/world', worldRouter);
app.use('/economy', economyRouter);
app.use('/characters', charactersRouter);
app.use('/jobs', jobsRouter);
app.use('/bank', bankRouter);
app.use('/map', mapRouter);
app.use('/companies', createCoreRouter('companies'));
app.use('/properties', createCoreRouter('properties'));
app.use('/vehicles', createCoreRouter('vehicles'));
app.use('/inventory', createCoreRouter('inventory'));
app.use('/missions', createCoreRouter('missions'));
app.use('/services', createCoreRouter('services'));
app.use('/moderation', createCoreRouter('moderation'));

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(error.status || 500).json({
    error: error.message || 'internal_server_error',
    message: config.environment === 'development' ? error.message : 'Unexpected server error'
  });
});

try {
  const db = await connectMongo();
  await seedMongo(db);

  app.listen(config.port, () => {
    console.log(`${config.worldName} backend running on port ${config.port}`);
    console.log(`MongoDB connected to database ${config.mongoDatabase}`);
  });
} catch (error) {
  console.error('Failed to start backend:', error.message);
  process.exit(1);
}
