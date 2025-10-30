import { fetchRaces} from '@/app/lib/actions/races/data';
import { race } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const races = await fetchRaces();
    return NextResponse.json(races);
  } catch{

  }
}