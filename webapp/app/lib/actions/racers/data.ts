import { PrismaClient } from '@prisma/client'
import { UUID } from 'crypto';
import { racer } from '@prisma/client';
import { Http2ServerResponse } from 'http2';

const prisma = new PrismaClient();

export async function fetchRacerById(racer_id : UUID){
    const racer = await prisma.racer.findUnique({where: {
        racer_id: racer_id,
    }})
    return racer;
}

export async function fetchRacers(){
    const racers = prisma.racer.findMany();
    return racers;
}

export async function createRacer(racer : racer){
    const createRacer = await prisma.racer.create({data : racer});
}