import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

dotenv.config({
  path: fileURLToPath(new URL('../.env', import.meta.url)),
  quiet: true
});

export const config = {
  port: Number(process.env.PORT || 3001),
  worldName: process.env.WORLD_NAME || 'Manaus Online',
  environment: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || '',
  mongoDatabase: process.env.MONGO_DATABASE || 'metaverso_manaus',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  corsOrigin: process.env.CORS_ORIGIN || '*'
};
