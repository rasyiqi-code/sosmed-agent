import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const persona = await prisma.persona.findFirst({
    include: {
      socialAccounts: true
    }
  });
  return NextResponse.json(persona);
}
