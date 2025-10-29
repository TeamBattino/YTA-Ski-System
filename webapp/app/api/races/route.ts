import { fetchRuns, fetchRunById, updateRun, createRun, deleteRun } from '@/app/lib/actions/runs/data';
import { run } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const races = await fetchRaces();
    return NextResponse.json(races);
  } catch{

  }
}