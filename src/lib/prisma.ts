import { PrismaClient } from '@prisma/client';
import { PGlite } from '@electric-sql/pglite';
import { PrismaPGlite } from 'pglite-prisma-adapter';

import path from 'path';

const prismaClientSingleton = () => {
  const dbPath = path.resolve(process.cwd(), './prisma/data');
  const pg = new PGlite(dbPath);
  const adapter = new PrismaPGlite(pg);
  
  const client = new PrismaClient({ adapter });
  
  // Debug: Check tables
  pg.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'").then(res => {
     console.log('[Prisma] Tables found:', res.rows.map(r => r.table_name));
  }).catch(err => console.error('[Prisma] Debug error:', err));
  
  return client;
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
