import { Router } from 'express';
import {
  findCharacterById,
  findJobById,
  listJobs,
  updateCharacter
} from '../repositories/game.repository.js';

export const jobsRouter = Router();

jobsRouter.get('/', async (_request, response, next) => {
  try {
    response.json({ jobs: await listJobs() });
  } catch (error) {
    next(error);
  }
});

jobsRouter.post('/:jobId/start', async (request, response, next) => {
  try {
    const { characterId = 'char-demo' } = request.body;
    const character = await findCharacterById(characterId);
    const job = await findJobById(request.params.jobId);

    if (!character) {
      response.status(404).json({ error: 'character_not_found' });
      return;
    }

    if (!job) {
      response.status(404).json({ error: 'job_not_found' });
      return;
    }

    character.activeJobId = job.id;
    character.experience += job.xpReward;
    character.walletCents += Math.round(job.salaryCents * 0.08);
    character.needs.energy = Math.max(0, character.needs.energy - 8);
    character.needs.stress = Math.min(100, character.needs.stress + 4);

    if (character.experience >= character.level * 100) {
      character.level += 1;
      character.experience = 0;
    }

    response.json({
      character: await updateCharacter(character),
      job,
      result: {
        paidCents: Math.round(job.salaryCents * 0.08),
        xp: job.xpReward,
        message: `Missao iniciada: ${job.mission}`
      }
    });
  } catch (error) {
    next(error);
  }
});
