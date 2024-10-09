import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Only PUT requests are allowed' });
  }

  const { id } = req.query;
  const updateData = req.body;

  try {
    const updatedLeader = await prisma.chapterLeader.update({
      where: { id: parseInt(id as string) },
      data: updateData,
    });

    return res
      .status(200)
      .json({ message: 'Chapter leader updated successfully', leader: updatedLeader });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error updating chapter leader', error: (error as Error).message });
  }
}
