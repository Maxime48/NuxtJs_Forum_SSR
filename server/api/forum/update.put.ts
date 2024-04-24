import { PrismaClient } from '@prisma/client';
import { defineEventHandler, readBody } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id;
    if (!id) {
        throw new Error('ID is required');
    }
    const body = await readBody(event);
    const { title, description } = body;
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