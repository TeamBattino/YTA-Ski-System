
import { createRacer, deleteRacer, fetchRacerBySkiPass, fetchRacers, updateOrCreateRacer } from '@/app/lib/actions/racers/data';
import { racer } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    let data: racer | any = {} as racer;

    if (req.body) {
      data = JSON.parse(req.body);
    }

    // Handle GET request
    if (req.method === 'GET') {
      if (!data.ski_pass) {
        const racers = await fetchRacers();
        res.status(200).json(racers);
      } else {
        const racerData = await fetchRacerBySkiPass(data.ski_pass);
        res.status(200).json(racerData);
      }
      return res;
    }

    // Handle POST request
    if (req.method === 'POST') {
      if (!data.name || !data.ldap || !data.location || !data.ski_pass) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      const newRacer = createRacer(data.name, data.ldap, data.ski_pass, data.location);
      res.status(200).json(newRacer);
      return res;
    }

    // Handle PUT request
    if (req.method === 'PUT') {
      if (!data.name || !data.ldap || !data.location || !data.ski_pass) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      const newRacer = await updateOrCreateRacer(data);
      res.status(200).json(newRacer);
      return res;
    }

    // Handle DELETE request
    if (req.method === 'DELETE') {
      if (data.ski_pass) {
        await deleteRacer(data.ski_pass);
        res.status(200).json({ message: 'Racer deleted successfully' });
      } else {
        res.status(400).json({ message: 'Ski pass is required for deletion' });
      }
      return res;
    }

    // If the method is not one of the above, return Method Not Allowed
    res.status(405).json({ message: 'Method Not Allowed' });

  } catch (error) {
    console.error("Error in racer API:", error);
    res.status(500).json({ message: 'Internal Server Error' });
    return res;
  }
}
