import crypto from 'node:crypto';
import { config } from '../config.js';
import { getMongo } from '../db/mongo.js';

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, expected] = storedHash.split(':');
  const actual = crypto.scryptSync(password, salt, 64);
  const expectedBuffer = Buffer.from(expected, 'hex');
  return crypto.timingSafeEqual(actual, expectedBuffer);
}

function signToken(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', config.jwtSecret)
    .update(body)
    .digest('base64url');
  return `${body}.${signature}`;
}

export function verifyToken(token) {
  const [body, signature] = token.split('.');
  const expected = crypto
    .createHmac('sha256', config.jwtSecret)
    .update(body)
    .digest('base64url');

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    throw new Error('invalid_token');
  }

  return JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
}

export async function registerAccount(data) {
  const email = String(data.email || '').trim().toLowerCase();
  const password = String(data.password || '');

  if (!email || password.length < 6) {
    const error = new Error('invalid_credentials');
    error.status = 400;
    throw error;
  }

  const account = {
    id: `acct-${Date.now()}`,
    email,
    displayName: data.displayName || 'Jogador',
    passwordHash: hashPassword(password),
    role: 'player',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  await getMongo().collection('accounts').insertOne(account);
  const token = signToken({ accountId: account.id, role: account.role });
  return { token, account: sanitizeAccount(account) };
}

export async function loginAccount(data) {
  const email = String(data.email || '').trim().toLowerCase();
  const account = await getMongo().collection('accounts').findOne({ email });

  if (!account || !verifyPassword(String(data.password || ''), account.passwordHash)) {
    const error = new Error('invalid_login');
    error.status = 401;
    throw error;
  }

  const token = signToken({ accountId: account.id, role: account.role });
  return { token, account: sanitizeAccount(account) };
}

function sanitizeAccount(account) {
  return {
    id: account.id,
    email: account.email,
    displayName: account.displayName,
    role: account.role,
    status: account.status
  };
}
