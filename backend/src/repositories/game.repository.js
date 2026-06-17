import { getMongo } from '../db/mongo.js';

export async function getWorldStatusFromDb() {
  const state = await getMongo().collection('world_state').findOne(
    { id: 'main-world' },
    { projection: { _id: 0 } }
  );

  return {
    name: 'Manaus Online',
    ...state.server,
    time: state.world.time,
    weather: state.world.weather,
    activeDistricts: state.world.districts.filter((district) => district.unlocked)
  };
}

export async function listCharacters(filter = {}) {
  return getMongo().collection('characters')
    .find(filter, { projection: { _id: 0 } })
    .sort({ createdAt: 1 })
    .toArray();
}

export async function findCharacterById(characterId) {
  return getMongo().collection('characters').findOne(
    { id: characterId },
    { projection: { _id: 0 } }
  );
}

export async function createCharacter(data) {
  const character = {
    id: `char-${Date.now()}`,
    accountId: data.accountId || null,
    fullName: data.fullName || 'Novo Morador',
    gender: data.gender || 'Homem',
    district: data.district || 'Centro',
    mapDistrictId: data.mapDistrictId || 'map-centro',
    position: data.position || { x: 55, y: 60 },
    appearance: {
      heightCm: Number(data.heightCm || 175),
      weightKg: Number(data.weightKg || 75),
      hair: data.hair || 'curto',
      outfit: data.outfit || 'casual'
    },
    level: 1,
    experience: 0,
    walletCents: 150000,
    activeJobId: null,
    needs: {
      hunger: 85,
      thirst: 85,
      sleep: 75,
      energy: 80,
      health: 100,
      hygiene: 90,
      stress: 10,
      happiness: 60
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };

  await getMongo().collection('characters').insertOne(character);
  const { _id, ...publicCharacter } = character;
  return publicCharacter;
}

export async function findMapDistrictById(mapDistrictId) {
  return getMongo().collection('map_districts').findOne(
    { id: mapDistrictId },
    { projection: { _id: 0 } }
  );
}

export async function updateCharacter(character) {
  character.updatedAt = new Date();
  await getMongo().collection('characters').updateOne(
    { id: character.id },
    { $set: character }
  );
  const { _id, ...publicCharacter } = character;
  return publicCharacter;
}

export async function listJobs() {
  return getMongo().collection('jobs')
    .find({}, { projection: { _id: 0 } })
    .sort({ category: 1, name: 1 })
    .toArray();
}

export async function findJobById(jobId) {
  return getMongo().collection('jobs').findOne(
    { id: jobId },
    { projection: { _id: 0 } }
  );
}

export async function getMarketSnapshotFromDb() {
  const prices = await getMongo().collection('market_items')
    .find({}, { projection: { _id: 0 } })
    .sort({ name: 1 })
    .toArray();
  const recentTransactions = await getMongo().collection('transactions')
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .limit(5)
    .toArray();

  return {
    currency: 'MNV',
    bank: 'Banco Solimoes',
    model: 'dynamic_supply_demand',
    generatedAt: new Date().toISOString(),
    prices,
    recentTransactions
  };
}

export async function createTransaction(transaction) {
  await getMongo().collection('transactions').insertOne(transaction);
  const { _id, ...publicTransaction } = transaction;
  return publicTransaction;
}

export async function listTransactions() {
  return getMongo().collection('transactions')
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray();
}
