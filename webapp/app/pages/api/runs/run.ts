import { deleteRun, fetchRunById, fetchRuns, updateOrCreateRun } from '@/app/lib/actions/runs/data';
import { run } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
 
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const data : run = JSON.parse(req.body)

  switch(req.method) { 
    case 'GET': { 
       if(req.body == null){
        res.json(fetchRuns())
       } else {
        res.json(fetchRunById(data.run_id))
       }
       break; 
    } 
    case 'POST': { 
       res.json(updateOrCreateRun(data))
       break; 
    } 
    case 'PUT': { 
        res.json(updateOrCreateRun(data))
        break; 
     } 
     case 'DELETE': { 
        res.json(deleteRun(data))
        break; 
     } 
    default: { 
       res.status(200).json({message: 'You made it to the run API! nice.'})
       break; 
    } 
 } 
}