import { fetchRacers, fetchRacerBySkiPass, createRacer, updateOrCreateRacer, deleteRacer } from '@/app/lib/actions/racers/data';
import { racer } from '@prisma/client';
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

export async function POST(req: Request) {
  if(!req.body) return NextResponse.json({ message: 'Error: body is empty' }, { status: 400 }); 
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
  if(!req.body) return NextResponse.json({ message: 'Error: body is empty' }, { status: 400 }); 
  try {
    const data: racer = await req.json();
    
    if (!data.name || !data.ldap || !data.location || !data.ski_pass) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newRacer = await updateOrCreateRacer(data);
    return NextResponse.json(newRacer);
  } catch (error) {
    console.error('Error handling PUT request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if(!req.body) return NextResponse.json({ message: 'Error: body is empty' }, { status: 400 }); 
  try {
    const data: any = await req.json();
    
    if (data.ski_pass) {
      await deleteRacer(data.ski_pass);
      return NextResponse.json({ message: 'Racer deleted successfully' });
    } else {
      return NextResponse.json({ message: 'Ski pass is required for deletion' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error handling DELETE request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
