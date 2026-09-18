import "server-only";
import prisma from "@/lib/prisma";
import type { Run } from "@/lib/db-helper";

export async function createRun(run: Run) {
  // Check if the ski_pass exists in the racer table
  const racerExists = await prisma.racer.findUnique({
    where: {
      racer_identifier: {
        ski_pass: run.ski_pass,
        race_id: run.race_id,
      },
    },
  });

  if (!racerExists) {
    throw new Error(
      `Racer with ski_pass ${run.ski_pass} and race_id ${run.race_id} does not exist.`
    );
  }

  // If racer exists, create the run
  const newRun = await prisma.run.create({
    data: {
      start_time: run.start_time,
      duration: run.duration,
      ski_pass: run.ski_pass,
      race_id: run.race_id,
    },
  });
  return newRun;
}

