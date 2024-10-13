// pages/api/chapter-leaders.js
import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../lib/prismaClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const chapterLeaders = await prisma.chapter_leaders.findMany({
      orderBy: {
        // Replace 'columnName' with the actual column you want to sort by
        first_name: 'asc',
      },
    });
    // console.log(chapterLeaders);
    res.status(200).json(chapterLeaders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chapter leaders' });
  }
}
