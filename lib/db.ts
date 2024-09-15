import { PrismaClient } from "@prisma/client";

export const db = globalThis.prisma || new PrismaClient()

// to avoid new to much PrismaClient in dev mode
if(process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db
}