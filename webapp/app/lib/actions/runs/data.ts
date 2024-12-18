import { PrismaClient } from '@prisma/client'
import { run } from '@prisma/client';

const prisma = new PrismaClient()

// Fetch all runs
export async function fetchRuns() {
    const runs = await prisma.run.findMany({
      include: {
        racer: true,
      }
    });
    return runs
}

// Fetch run by id
export async function fetchRunById(run_id: string) {
    const run = await prisma.run.findUnique({
        where: { run_id: run_id },
    });

    if (!run) {
        throw new Error(`Run with ID ${run_id} not found.`);
    }
    return run;
}

export async function createRun(run: Omit<run, 'run_id'>) {
  // Check if the ski_pass exists in the racer table
  const racerExists = await prisma.racer.findUnique({
      where: { ski_pass: run.ski_pass! },
  });

  if (!racerExists) {
      throw new Error(`Racer with ski_pass ${run.ski_pass} does not exist.`);
  }

  // If racer exists, create the run
  const newRun = await prisma.run.create({
      data: {
          start_time: run.start_time,
          duration: run.duration,
          ski_pass: run.ski_pass,
      },
  });
  return newRun;
}
// Update an existing run by run_id
export async function updateRun(run: run) {
    const updatedRun = await prisma.run.update({
        where: {
            run_id: run.run_id,
        },
        data: {
            start_time: run.start_time,
            duration: run.duration,
            ski_pass: run.ski_pass,
        },
    });
    return updatedRun;
}

// Delete run
export async function deleteRun(run_id : string) {
    await prisma.run.delete({
        where: {
            run_id: run_id
        }
    }).then((res) => console.log(res))
}
