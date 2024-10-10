import type { NextApiRequest, NextApiResponse } from 'next';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Validate request method
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Only GET requests are allowed' });
  }

  const { id } = req.query;

  // Validate id
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Missing or invalid id' });
  }

  try {
    // Fetch the chapter leader using Prisma
    const chapterLeader = await prisma.chapter_leaders.findUnique({
      where: { id: Number(id) },
    });

    // If no chapter leader is found, return a 404 error
    if (!chapterLeader) {
      return res.status(404).json({ message: 'Chapter leader not found' });
    }

    // Return the chapter leader data and explicitly return to exit the function
    return res.status(200).json(chapterLeader);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching chapter leader', error: (error as Error).message });
  }
}
