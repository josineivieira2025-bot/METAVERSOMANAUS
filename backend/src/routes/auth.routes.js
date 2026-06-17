import { Router } from 'express';
import { loginAccount, registerAccount } from '../services/auth.service.js';

export const authRouter = Router();

authRouter.post('/register', async (request, response, next) => {
  try {
    response.status(201).json(await registerAccount(request.body));
  } catch (error) {
    next(error);
  }
});

authRouter.post('/login', async (request, response, next) => {
  try {
    response.json(await loginAccount(request.body));
  } catch (error) {
    next(error);
  }
});
