import { Router } from 'express';
import {
  createTransaction,
  findCharacterById,
  listTransactions,
  updateCharacter
} from '../repositories/game.repository.js';

export const bankRouter = Router();

bankRouter.post('/pix', async (request, response, next) => {
  try {
    const { fromCharacterId = 'char-demo', toCharacterId, amountCents, description = 'PIX Manaus Online' } = request.body;
    const from = await findCharacterById(fromCharacterId);
    const to = await findCharacterById(toCharacterId);
    const amount = Number(amountCents);

    if (!from || !to) {
      response.status(404).json({ error: 'character_not_found' });
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      response.status(400).json({ error: 'invalid_amount' });
      return;
    }

    if (from.walletCents < amount) {
      response.status(409).json({ error: 'insufficient_funds' });
      return;
    }

    from.walletCents -= amount;
    to.walletCents += amount;

    const transaction = await createTransaction({
      id: `tx-${Date.now()}`,
      fromCharacterId: from.id,
      toCharacterId: to.id,
      amountCents: amount,
      description,
      createdAt: new Date().toISOString()
    });

    response.status(201).json({
      transaction,
      from: await updateCharacter(from),
      to: await updateCharacter(to)
    });
  } catch (error) {
    next(error);
  }
});

bankRouter.get('/transactions', async (_request, response, next) => {
  try {
    response.json({ transactions: await listTransactions() });
  } catch (error) {
    next(error);
  }
});
