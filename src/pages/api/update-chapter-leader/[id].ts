import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Only PUT requests are allowed' });
  }

  const { id } = req.query; // Chapter leader ID from the query parameters
  const updateData = req.body; // Data to update

  try {
    // Update the chapter leader in the database using Prisma
    const updatedLeader = await prisma.chapterLeader.update({
      where: { id: parseInt(id as string) }, // Cast id to string before parsing
      data: updateData,
    });

    // Respond with the updated leader
    res.status(200).json({ message: 'Chapter leader updated successfully', leader: updatedLeader });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating chapter leader', error: (error as Error).message });
  }
}
