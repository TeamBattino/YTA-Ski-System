import { PrismaClient } from '@prisma/client'
import { run } from '@prisma/client';

const prisma = new PrismaClient()

//Fetch all runs
export async function fetchRuns() {
    const runs = await prisma.run.findMany({
      include: {
        racer: true,
      }
    });
    return runs
}

//Fetch run by id
export async function fetchRunById(run_id : string){
    const run = await prisma.run.findUnique({
        where: { run_id },
      });
    
      if (!run) {
        throw new Error(`Run with ID ${run_id} not found.`);
      }
      return run;
}

//Update run or create run if record doesnt exist yet
export async function updateOrCreateRun(run: run) {
    const newrun = await prisma.run.upsert({ 
      where: {
        run_id: run.run_id,
      },
      update: {
        run_id: run.run_id,
        duration: run.duration,
        ski_pass: run.ski_pass,
        start_time: run.start_time,

      },
      create: {
        run_id: run.run_id,
        duration: run.duration,
        ski_pass: run.ski_pass,
        start_time: new Date(),
      },
     });
    return newrun;
  }
  
  //Delete run
  export async function deleteRun(run: run){
     await prisma.run.delete({  // const deleterun =
      where: {
        run_id: run.run_id
      }
    }).then((res) => console.log(res))
  }