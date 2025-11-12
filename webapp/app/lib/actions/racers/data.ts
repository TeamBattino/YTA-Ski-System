import { PrismaClient } from "@prisma/client";
import { racer } from "@prisma/client";

const prisma = new PrismaClient();

export async function fetchRacerBySkiPass(ski_pass: string, race_id: string) {
  const racer = await prisma.racer.findUnique({
    where: {
      racer_identifier : {
        ski_pass: ski_pass,
        race_id: race_id,
      },      
    },
  });
  return racer;
}

export async function fetchRacers() {
  const racers = await prisma.racer.findMany();
  return racers;
}

export async function createRacer(
  name: string,
  ldap: string,
  ski_pass: string,
  location: string
) {
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
export async function updateRacer(
  racerData: Partial<racer> & { racer_id: string }
) {
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

export async function deleteRacer(racer_id: string) {
  await prisma.racer.delete({
    where: {
      racer_id: racer_id,
    },
  });
  return;
}

export async function bruh(racer: racer) {
  const recentRuns = await prisma.run.findMany({
    where: { ski_pass: racer.ski_pass },
    select: {
      duration: true,
    },
    orderBy: { start_time: "desc" },
  });

  return recentRuns;
}
