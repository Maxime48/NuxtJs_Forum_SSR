import { PrismaClient } from '@prisma/client';
import { defineEventHandler } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id;
    if (!id) {
        throw new Error('ID is required');
    }
    const forum = await prisma.forum.findUnique({
        where: {
            id: Number(id),
        },
    });
    return forum;
});