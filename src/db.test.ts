import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectDB } from './db';

describe('connectDB', () => {
  let mongoServer: MongoMemoryServer;
  const originalDatabaseUrl = process.env.DATABASE_URL;

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.DATABASE_URL = mongoServer.getUri();
  });

  afterEach(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    process.env.DATABASE_URL = originalDatabaseUrl;
  });

  it('connects when DATABASE_URL is valid', async () => {
    await connectDB();
    expect(mongoose.connection.readyState).toBe(1);
  });

  it('throws when DATABASE_URL is missing', async () => {
    delete process.env.DATABASE_URL;
    await expect(connectDB()).rejects.toThrow('DATABASE_URL is not defined');
  });
});
