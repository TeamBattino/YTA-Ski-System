import { fetchRacers, fetchRacerBySkiPass } from '@/lib/db-helper';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const ski_pass = url.searchParams.get("ski_pass");

    if (!ski_pass) {
      const racers = await fetchRacers();
      return NextResponse.json(racers);
    } else {
      const racerData = await fetchRacerBySkiPass(ski_pass);
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