import { PrismaClient } from '@prisma/client'
import { UUID } from 'crypto';
import { racer } from '@prisma/client';

const prisma = new PrismaClient();

export async function fetchRacerById(racer_id : UUID){
    const racer = await prisma.racer.findUnique({where: {
        racer_id: racer_id,
    }})
    return racer;
}

export async function fetchRacers(){
    const racers = await prisma.racer.findMany();
    return racers;
}

export async function createRacer(racer : racer){
    const createRacer = await prisma.racer.create({data : racer});
}

export async function bruh(racer : racer){
    const recentRuns = await prisma.run.findMany({
        where: {racer_id: racer.racer_id},
        select: {
            duration: true
        },
        orderBy: {start_time : 'desc'},
    });
    return recentRuns;
}