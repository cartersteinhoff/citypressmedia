// pages/api/chapter-leaders.js
import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../lib/prismaClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const chapterLeaders = await prisma.chapter_leaders.findMany();
    res.status(200).json(chapterLeaders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chapter leaders' });
  }
}
