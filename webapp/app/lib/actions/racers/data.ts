import { PrismaClient } from '@prisma/client';
import { racer } from '@prisma/client';

const prisma = new PrismaClient();

export async function fetchRacerBySkiPass(ski_pass: string) {
  const racer = await prisma.racer.findUnique({
    where: { ski_pass: ski_pass },
  });

  if (!racer) {
    throw new Error(`Racer with ski pass ${ski_pass} not found.`);
  }

  return racer;
}

export async function fetchRacers() {
  const racers = await prisma.racer.findMany();
  return racers;
}

export async function createRacer(name: string, ldap: string, ski_pass: string, location: string) {
  const newRacer = await prisma.racer.create({
    data: {
      name: name,
      ldap: ldap,
      ski_pass: ski_pass,
      location: location,
    },
  });
  return newRacer;
}

export async function updateRacer(racerData: racer) {
  const updatedRacer = await prisma.racer.update({
    where: {
      racer_id: racerData.racer_id,
    },
    data: {
      name: racerData.name,
      ldap: racerData.ldap,
      ski_pass: racerData.ski_pass,
      location: racerData.location,
    },
  });
  return updatedRacer;
}

export async function deleteRacer(ski_pass: string) {
  await prisma.racer.delete({
    where: {
      ski_pass: ski_pass,
    },
  });
  return;
}
