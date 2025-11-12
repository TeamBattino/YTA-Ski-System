import { fetchRuns, fetchRunById, updateRun, createRun, deleteRun } from '@/app/lib/actions/runs/data';
import { run } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(req : Request) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get("query");
    
    if (query && query.trim() !== '') {
      // If query is provided and not empty, filter based on the query
      const runs = await fetchRuns();

      // Filter runs by query (ski_pass or run_id)
      const filteredRuns = runs.filter(run => {
        return (
          (run.ski_pass && run.ski_pass.toLowerCase().includes(query.toLowerCase())) || 
          (run.run_id && run.run_id.toString().includes(query))
        );
      });

      return NextResponse.json(filteredRuns);
    } else {
      // If no query or empty query, return all runs
      const runs = await fetchRuns();
      return NextResponse.json(runs);
    }
  } catch (error) {
    console.error('Error handling GET request for runs:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

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

    if (!data.run_id || !data.duration || !data.ski_pass || !data.start_time) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const updatedRun = await updateRun(data);
    return NextResponse.json(updatedRun);
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
      return NextResponse.json({ message: 'Run ID is required for deletion' }, { status: 400 });
    }
    await deleteRun(id);

    return NextResponse.json({ message: 'Run deleted successfully' });
  } catch (error) {
    console.error('Error handling DELETE request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}