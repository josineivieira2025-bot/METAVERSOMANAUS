import { Router } from 'express';
import {
  createCharacter,
  findCharacterById,
  findMapDistrictById,
  listCharacters,
  updateCharacter
} from '../repositories/game.repository.js';

export const charactersRouter = Router();

charactersRouter.get('/', async (request, response, next) => {
  try {
    const filter = request.query.accountId ? { accountId: request.query.accountId } : {};
    response.json({ characters: await listCharacters(filter) });
  } catch (error) {
    next(error);
  }
});

charactersRouter.post('/', async (request, response, next) => {
  try {
    response.status(201).json({ character: await createCharacter(request.body) });
  } catch (error) {
    next(error);
  }
});

charactersRouter.post('/:characterId/move', async (request, response, next) => {
  try {
    const character = await findCharacterById(request.params.characterId);
    const district = await findMapDistrictById(request.body.mapDistrictId);

    if (!character) {
      response.status(404).json({ error: 'character_not_found' });
      return;
    }

    if (!district) {
      response.status(404).json({ error: 'district_not_found' });
      return;
    }

    if (!district.unlocked) {
      response.status(409).json({ error: 'district_locked' });
      return;
    }

    character.mapDistrictId = district.id;
    character.district = district.name;
    character.position = {
      x: district.x + district.width / 2,
      y: district.y + district.height / 2
    };
    character.needs.energy = Math.max(0, character.needs.energy - 6);
    character.needs.thirst = Math.max(0, character.needs.thirst - 3);
    character.needs.stress = Math.min(100, character.needs.stress + Math.round(district.traffic / 25));

    response.json({
      character: await updateCharacter(character),
      result: {
        message: `Voce chegou em ${district.name}.`,
        traffic: district.traffic,
        floodRisk: district.floodRisk
      }
    });
  } catch (error) {
    next(error);
  }
});

charactersRouter.post('/:characterId/needs/tick', async (request, response, next) => {
  try {
    const character = await findCharacterById(request.params.characterId);

    if (!character) {
      response.status(404).json({ error: 'character_not_found' });
      return;
    }

    character.needs.hunger = Math.max(0, character.needs.hunger - 4);
    character.needs.thirst = Math.max(0, character.needs.thirst - 5);
    character.needs.energy = Math.max(0, character.needs.energy - 3);
    character.needs.stress = Math.min(100, character.needs.stress + 2);

    response.json({ character: await updateCharacter(character) });
  } catch (error) {
    next(error);
  }
});
