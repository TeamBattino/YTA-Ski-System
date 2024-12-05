import { deleteRacer, fetchRacerBySkiPass, fetchRacers, updateOrCreateRacer } from '@/app/lib/actions/racers/data';
import { racer } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
 
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const data : racer = JSON.parse(req.body)

  switch(req.method) { 
    case 'GET': { 
       if(req.body == null){
        res.json(fetchRacers())
       } else {
         if(data.ski_pass)
        res.json(fetchRacerBySkiPass(data.ski_pass))
       }
       break; 
    } 
    case 'POST': { 
       res.json(updateOrCreateRacer(data))
       break; 
    } 
    case 'PUT': { 
        res.json(updateOrCreateRacer(data))
        break; 
     } 
     case 'DELETE': { 
        res.json(deleteRacer(data))
        break; 
     } 
    default: { 
       res.status(200).json({message: 'You made it to the racer API! nice.'})
       break; 
    } 
 } 
}