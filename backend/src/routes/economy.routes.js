import { Router } from 'express';
import { getMarketSnapshot } from '../services/economy.service.js';

export const economyRouter = Router();

economyRouter.get('/prices', async (_request, response, next) => {
  try {
    response.json(await getMarketSnapshot());
  } catch (error) {
    next(error);
  }
});
