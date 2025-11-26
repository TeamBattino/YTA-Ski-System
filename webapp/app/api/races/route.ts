import { getRaces } from '@/lib/db-helper';
import { race } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const races = await getRaces();
    return NextResponse.json(races);
  } catch{

  }
}