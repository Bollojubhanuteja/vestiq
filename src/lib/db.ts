import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { INITIAL_DB_BASE64 } from './initial-db';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function initDatabaseUrl(): string {
  const isServerless = process.env.VERCEL === '1' || Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);

  if (isServerless) {
    const tmpDbPath = '/tmp/dev.db';
    if (!fs.existsSync(tmpDbPath)) {
      const candidatePaths = [
        path.join(process.cwd(), 'prisma', 'dev.db'),
        path.join(process.cwd(), 'dev.db'),
      ];

      let copied = false;
      for (const candidate of candidatePaths) {
        if (fs.existsSync(candidate)) {
          try {
            fs.copyFileSync(candidate, tmpDbPath);
            copied = true;
            break;
          } catch (e) {
            console.error('Error copying db from ' + candidate + ':', e);
          }
        }
      }

      if (!copied && INITIAL_DB_BASE64) {
        try {
          const buffer = Buffer.from(INITIAL_DB_BASE64, 'base64');
          fs.writeFileSync(tmpDbPath, buffer);
        } catch (e) {
          console.error('Error writing fallback db to /tmp:', e);
        }
      }
    }

    const resolvedUrl = `file:${tmpDbPath}`;
    process.env.DATABASE_URL = resolvedUrl;
    return resolvedUrl;
  }

  return process.env.DATABASE_URL || 'file:./dev.db';
}

const dbUrl = initDatabaseUrl();

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
