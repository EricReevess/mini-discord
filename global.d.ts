// global.d.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // Add prisma to the global object
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}
