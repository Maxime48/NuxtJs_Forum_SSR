import { PrismaClient } from '@prisma/client';
import { defineEventHandler, readBody } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { id, title, description } = body;
    if (!id) {
        throw new Error('ID is required');
    }
    const updatedForum = await prisma.forum.update({
        where: {
            id: Number(id),
        },
        data: {
            title: title,
            description: description,
        },
    });
    return updatedForum;
});