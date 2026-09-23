/**
 * Dev entry point: starts an in-memory MongoDB bound to a fixed port (27017),
 * then loads the normal server so backend + seed script share one database.
 */
import { MongoMemoryServer } from 'mongodb-memory-server';

const server = await MongoMemoryServer.create({ instance: { port: 27017, dbName: 'parkingease' } });
process.env.MONGO_URI = server.getUri('parkingease');
console.log(`In-Memory MongoDB started at ${process.env.MONGO_URI}`);

await import('./server.js');
