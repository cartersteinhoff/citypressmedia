import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    city,
    reservedCity, // New field for reserved city
    state,
    address1, // Required
    address2, // Optional
    zip, // Required
    referredByFirstName, // Optional
    referredByLastName, // Optional
  } = req.body;

  console.log(req.body);

  // Validate required fields
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !city ||
    !reservedCity ||
    !state ||
    !address1 ||
    !zip
  ) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Create a new chapter leader in the database using Prisma
    const newLeader = await prisma.chapterLeader.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        city,
        reservedCity, // Save the reserved city in the database
        state,
        address1, // Required
        address2: address2 || null, // Handle optional fields
        zip, // Required
        referredByFirstName: referredByFirstName || null,
        referredByLastName: referredByLastName || null,
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
