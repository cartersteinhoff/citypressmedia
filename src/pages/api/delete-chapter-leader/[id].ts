// /pages/api/chapter-leader/delete.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Only DELETE requests are allowed' });
  }

  const { id } = req.query;

  // Validate id
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Missing or invalid id' });
  }

  try {
    // Delete the chapter leader using Prisma
    const deletedLeader = await prisma.chapterLeader.delete({
      where: { id: Number(id) },
    });

    // Respond with the deleted leader's data
    return res
      .status(200)
      .json({ message: 'Chapter leader deleted successfully', leader: deletedLeader });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Error deleting chapter leader',
      error: (error as Error).message,
    });
  }
}
