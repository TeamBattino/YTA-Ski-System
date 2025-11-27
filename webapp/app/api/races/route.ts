import { getRaces } from '@/lib/db-helper';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const races = await getRaces();
    return NextResponse.json(races);
  } catch{

  }
}