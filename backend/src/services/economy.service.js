import { getMarketSnapshotFromDb } from '../repositories/game.repository.js';

export async function getMarketSnapshot() {
  return getMarketSnapshotFromDb();
}
