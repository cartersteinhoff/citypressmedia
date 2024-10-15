import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client'; // Blank line to separate import groups

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Fetching chapter leader count...');
    const chapterLeaderCount = await prisma.chapter_leaders.count();
    console.log('Chapter leader count fetched:', chapterLeaderCount);

    return res.status(200).json({ chapterLeaderCount });
  } catch (error) {
    console.error('Error fetching chapter leader count:', error);
    return res.status(500).json({
      message: 'Error getting Chapter Leader count',
      error: (error as Error).message,
    });
  }
}
