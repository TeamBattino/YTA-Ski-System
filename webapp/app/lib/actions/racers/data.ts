import { PrismaClient } from '@prisma/client';
import { racer } from '@prisma/client';

const prisma = new PrismaClient();

// Fetch by Id
export async function fetchRacerById(racer_id: string) {
  const racer = await prisma.racer.findUnique({
    where: { racer_id },
  });

  if (!racer) {
    throw new Error(`Racer with ID ${racer_id} not found.`);
  }

  return racer;
}

// Fetch all racers
export async function fetchRacers() {
  const racers = await prisma.racer.findMany();
  return racers;
}

//Update racer or create racer if record doesnt exist yet
export async function updateOrCreateRacer(racer: racer) {
  const newRacer = await prisma.racer.upsert({ 
    where: {
      racer_id: racer.racer_id,
    },
    update: {
      racer_id: racer.racer_id,
      ldap: racer.ldap,
      name: racer.name,
      ski_passes: racer.ski_passes,
    },
    create: {
      racer_id: racer.racer_id,
      ldap: racer.ldap,
      name: racer.name,
      ski_passes: racer.ski_passes,
    },
   });
  return newRacer;
}

//Delete racer
export async function deleteRacer(racer: racer){
  const deleteRacer = await prisma.racer.delete({
    where: {
      racer_id: racer.racer_id
    }
  }).then((res) => console.log(res))
}

// Fetch recent runs for a given racer
export async function bruh(racer: racer) {
  const recentRuns = await prisma.run.findMany({
    where: { racer_id: racer.racer_id },
    select: {
      duration: true,
    },
    orderBy: { start_time: 'desc' },
  });

  return recentRuns;
}
