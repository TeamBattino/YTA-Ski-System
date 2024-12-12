import { fetchRuns, fetchRunById, updateRun, createRun, deleteRun } from '@/app/lib/actions/runs/data';
import { run } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
   try {
     const url = new URL(req.url);  
     const run_id = url.searchParams.get("run_id");
 
     if (!run_id) {
       const runs = await fetchRuns();
       return NextResponse.json(runs);
     } else {
       const runData = await fetchRunById(run_id);
       if (!runData) {
         return NextResponse.json({ message: 'Run not found' }, { status: 404 });
       }
       return NextResponse.json(runData);
     }
   } catch (error) {
     console.error('Error handling GET request:', error);
     return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
   }
 }


export async function POST(req: Request) {
   if (!req.body) return NextResponse.json({ message: 'Error: body is empty' }, { status: 400 });

   try {
     const data: Omit<run, 'run_id'> = await req.json();  // omit run_id for create operation

     if (!data.duration || !data.ski_pass || !data.start_time) {
       return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
     }

     // Try to create the run
     const newRun = await createRun(data);
     return NextResponse.json(newRun);
   } catch (error) {
     console.error('Error handling POST request:', error);
     return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
   }
}

export async function PUT(req: Request) {
   if(!req.body) return NextResponse.json({ message: 'Error: body is empty' }, { status: 400 }); 
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
   if(!req.body) return NextResponse.json({ message: 'Error: body is empty' }, { status: 400 }); 
  try {
    const data: any = await req.json();
    
    if (data.run_id) {
      await deleteRun({
         run_id: data.run_id,
         ski_pass: null,
         start_time: null,
         duration: null
      });
      return NextResponse.json({ message: 'Run deleted successfully' });
    } else {
      return NextResponse.json({ message: 'Run ID is required for deletion' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error handling DELETE request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
