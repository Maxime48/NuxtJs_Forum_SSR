import { PrismaClient } from '@prisma/client';
import { defineEventHandler, readBody } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id;
    if (!id) {
        throw new Error('ID is required');
    }
    const deletedForum = await prisma.forum.delete({
        where: {
            id: Number(id)
        },
    });
    return deletedForum;
});