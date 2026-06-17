import { Router } from 'express';
import { getWorldStatus } from '../services/world.service.js';

export const worldRouter = Router();

worldRouter.get('/status', async (_request, response, next) => {
  try {
    response.json(await getWorldStatus());
  } catch (error) {
    next(error);
  }
});
