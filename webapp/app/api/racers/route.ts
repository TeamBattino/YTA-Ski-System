import { fetchRacers, fetchRacerBySkiPass, createRacer, updateRacer, deleteRacer } from '@/app/lib/actions/racers/data';
import { racer } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const ski_pass = url.searchParams.get("ski_pass");
    const race_id = url.searchParams.get("race_id");

    if (!ski_pass || !race_id) {
      const racers = await fetchRacers();
      return NextResponse.json(racers);
    } else {
      const racerData = await fetchRacerBySkiPass(ski_pass, race_id);
      if (!racerData) {
        return NextResponse.json({ message: 'Racer not found' }, { status: 404 });
      }
      return NextResponse.json(racerData);
    }
  } catch (error) {
    console.error('Error handling GET request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}