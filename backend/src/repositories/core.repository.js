import { getMongo } from '../db/mongo.js';

const publicProjection = { projection: { _id: 0 } };

export async function listCollection(collectionName, sort = { createdAt: 1 }) {
  return getMongo().collection(collectionName)
    .find({}, publicProjection)
    .sort(sort)
    .toArray();
}

export async function findById(collectionName, id) {
  return getMongo().collection(collectionName).findOne({ id }, publicProjection);
}

export async function createRecord(collectionName, prefix, data) {
  const now = new Date();
  const record = {
    id: `${prefix}-${Date.now()}`,
    ...data,
    createdAt: now,
    updatedAt: now
  };

  await getMongo().collection(collectionName).insertOne(record);
  const { _id, ...publicRecord } = record;
  return publicRecord;
}

export async function updateRecord(collectionName, id, patch) {
  const updatedAt = new Date();
  await getMongo().collection(collectionName).updateOne(
    { id },
    { $set: { ...patch, updatedAt } }
  );
  return findById(collectionName, id);
}
