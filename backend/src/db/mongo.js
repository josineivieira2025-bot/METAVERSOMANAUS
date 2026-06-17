import { MongoClient } from 'mongodb';
import { config } from '../config.js';

let client;
let database;

export async function connectMongo() {
  if (database) {
    return database;
  }

  if (!config.mongoUri) {
    throw new Error('MONGO_URI is not configured');
  }

  client = new MongoClient(config.mongoUri, {
    serverSelectionTimeoutMS: 10000
  });
  await client.connect();
  database = client.db(config.mongoDatabase);
  await createIndexes(database);
  return database;
}

export function getMongo() {
  if (!database) {
    throw new Error('MongoDB is not connected');
  }

  return database;
}

async function createIndexes(db) {
  await Promise.all([
    db.collection('characters').createIndex({ id: 1 }, { unique: true }),
    db.collection('jobs').createIndex({ id: 1 }, { unique: true }),
    db.collection('market_items').createIndex({ code: 1 }, { unique: true }),
    db.collection('accounts').createIndex({ email: 1 }, { unique: true }),
    db.collection('companies').createIndex({ id: 1 }, { unique: true }),
    db.collection('properties').createIndex({ id: 1 }, { unique: true }),
    db.collection('vehicles').createIndex({ id: 1 }, { unique: true }),
    db.collection('inventory_items').createIndex({ id: 1 }, { unique: true }),
    db.collection('missions').createIndex({ id: 1 }, { unique: true }),
    db.collection('map_districts').createIndex({ id: 1 }, { unique: true }),
    db.collection('map_landmarks').createIndex({ id: 1 }, { unique: true }),
    db.collection('map_routes').createIndex({ id: 1 }, { unique: true }),
    db.collection('public_services').createIndex({ id: 1 }, { unique: true }),
    db.collection('moderation_reports').createIndex({ id: 1 }, { unique: true }),
    db.collection('transactions').createIndex({ createdAt: -1 }),
    db.collection('world_state').createIndex({ id: 1 }, { unique: true })
  ]);
}
