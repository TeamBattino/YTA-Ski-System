import { PrismaClient } from '@prisma/client';
import { racer } from '@prisma/client';

const prisma = new PrismaClient();

// Fetch by Id
export async function fetchRacerBySkiPass(ski_pass: string) {
  const racer = await prisma.racer.findUnique({
    where: { ski_pass: ski_pass },
  });

  if (!racer) {
    throw new Error(`Racer with ski passs ${ski_pass} not found.`);
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
      racer_id: racer.racer_id
    },
    update: {
      racer_id: racer.racer_id,
      ldap: racer.ldap,
      name: racer.name,
      ski_pass: racer.ski_pass,
      location: racer.location,
    },
    create: {
      racer_id: racer.racer_id,
      ldap: racer.ldap,
      name: racer.name,
      ski_pass: racer.ski_pass,
      location: racer.location,
    },
   });
  return newRacer;
}

//Create racer without racer_id
export async function createRacer(name: string, ldap: string, ski_pass: string, location: string){
  const newRacer = await prisma.racer.create({
    data: {
      location: location,
      name: name,
      ski_pass: ski_pass,
      ldap: ldap,
    }
  })
  return newRacer;
}

//Delete racer
export async function deleteRacer(ski_pass: string){
  const deleteRacer = await prisma.racer.delete({
    where: {
      ski_pass: ski_pass,
    }
  }).then((res) => console.log(res))
}

// Fetch recent runs for a given racer
export async function bruh(racer: racer) {
  const recentRuns = await prisma.run.findMany({
    where: { ski_pass: racer.ski_pass },
    select: {
      duration: true,
    },
    orderBy: { start_time: 'desc' },
  });

  return recentRuns;
}
