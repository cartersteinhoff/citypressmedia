import type { NextApiRequest, NextApiResponse } from 'next';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const {
    first_name,
    last_name,
    email,
    phone,
    city,
    reserved_cities, // New field for reserved city
    state,
    address1, // Required
    address2, // Optional
    zip, // Required
    referred_by_first_name,
    referred_by_last_name,
  } = req.body;

  console.log(req.body);

  // Validate required fields
  if (
    !first_name ||
    !last_name ||
    !email ||
    !phone ||
    !city ||
    !reserved_cities ||
    !state ||
    !address1 ||
    !zip
  ) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Create a new chapter leader in the database using Prisma
    const newLeader = await prisma.chapter_leaders.create({
      data: {
        first_name,
        last_name,
        email,
        phone,
        city,
        reserved_cities, // Save the reserved city in the database
        state,
        address1, // Required
        address2: address2 || null, // Handle optional fields
        zip, // Required
        referred_by_first_name: referred_by_first_name || null,
        referred_by_last_name: referred_by_last_name || null,
      },
    });

    // Respond with the created leader
    return res
      .status(201)
      .json({ message: 'Chapter leader created successfully', leader: newLeader });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Error creating chapter leader',
      error: (error as Error).message,
    });
  }
}
