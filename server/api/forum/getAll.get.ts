import { PrismaClient } from '@prisma/client';
import { defineEventHandler } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const forums = await prisma.forum.findMany({ //nombre de sujets par forum
        select: {
            id: true,
            title: true,
            description: true,
            createdAt: true,
            updatedAt: true,
            _count: {
                select: { subjects: true }
            }
        }
    });

    return forums;
});