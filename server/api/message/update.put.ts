import { PrismaClient } from '@prisma/client';
import { defineEventHandler, readBody } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id;
    if (!id) {
        throw new Error('ID is required');
    }
    const body = await readBody(event);
    const { content } = body;
    const updatedMessage = await prisma.message.update({
        where: {
            id: Number(id),
        },
        data: {
            content: content,
        },
    });
    return updatedMessage;
});