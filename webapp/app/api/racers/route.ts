import { fetchRacers, fetchRacerBySkiPass, createRacer, updateRacer, deleteRacer } from '@/app/lib/actions/racers/data';
import { racer } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(req : Request) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get("query");  // Fetch the query string from URL
    
    if (query && query.trim() !== '') {
      console.log('hmm i think this query is not empty')
      // If query is provided and not empty, filter based on the query
      const racers = await fetchRacers();

      // Filter racers by query (ski_pass, name, or ldap)
      const filteredRacers = racers.filter(racer => {
        return (
          (racer.ski_pass && racer.ski_pass.toLowerCase().includes(query.toLowerCase())) || 
          (racer.name && racer.name.toLowerCase().includes(query.toLowerCase())) ||
          (racer.ldap && racer.ldap.toLowerCase().includes(query.toLowerCase()))
        );
      });

      return NextResponse.json(filteredRacers);
    } else {
      // If no query or empty query, return all racers
      const racers = await fetchRacers();
      return NextResponse.json(racers);
    }
  } catch (error) {
    console.error('Error handling GET request for racers:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
export async function POST(req: Request) {
  if (!req.body) return NextResponse.json({ message: 'Error: body is empty' }, { status: 400 }); 
  try {
    const data: racer = await req.json();
    
    if (!data.name || !data.ldap || !data.location || !data.ski_pass) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newRacer = await createRacer(data.name, data.ldap, data.ski_pass, data.location);
    return NextResponse.json(newRacer);
  } catch (error) {
    console.error('Error handling POST request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!req.body) return NextResponse.json({ message: 'Error: body is empty' }, { status: 400 }); 
  try {
    const data: racer = await req.json();
    
    if (!data.racer_id || !data.ski_pass || !data.name || !data.ldap || !data.location) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const updatedRacer = await updateRacer(data);
    return NextResponse.json(updatedRacer);
  } catch (error) {
    console.error('Error handling PUT request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {

  const url = new URL(req.url);
  const id = url.searchParams.get("id");  // Fetch the query string from URL

  try {
    if (!id) {
      return NextResponse.json({ message: 'Racer Ski pass is required for deletion' }, { status: 400 });
    }
    await deleteRacer(id);

    return NextResponse.json({ message: 'Racer deleted successfully' });
  } catch (error) {
    console.error('Error handling DELETE request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}