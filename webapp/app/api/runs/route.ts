import {  updateRun, createRun } from '@/lib/db-helper';
import { run } from '@prisma/client';
import { NextResponse } from 'next/server';

type PostRunProps = {

  duration: number;
  ski_pass: string;
  race_id: string;

}

export async function POST(req: Request) {
  if (req.headers.get('secret-key') !== process.env.AUTH_SECRET) {
    return NextResponse.json({ message: 'Invalid secret key' }, { status: 401 });
  }
  if (!req.body) return NextResponse.json({ message: 'Error: body is empty' }, { status: 400 });

  try {
    const data: PostRunProps = await req.json();  // omit run_id for create operation

    if (!data || !data.ski_pass || !data) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Try to create the run
    const run = {
      duration: data.duration,
      ski_pass: data.ski_pass,
      start_time: new Date(),
      race_id: data.race_id,
    }
    const newRun = await createRun(run);
    return NextResponse.json(newRun);
  } catch (error) {
    console.error('Error handling POST request:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!req.body) return NextResponse.json({ message: 'Error: body is empty' }, { status: 400 });
  try {
    const data: run = await req.json();

    if (!data.run_id || !data.duration || !data.ski_pass || !data.start_time || !data.race_id) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const updatedRun = await updateRun(data);
    return NextResponse.json(updatedRun);
  } catch (error) {
    console.error('Error handling PUT request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}