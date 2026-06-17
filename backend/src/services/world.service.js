import { getWorldStatusFromDb } from '../repositories/game.repository.js';

export async function getWorldStatus() {
  return getWorldStatusFromDb();
}
