import { PrismaClient } from '@prisma/client';
import { defineEventHandler, readBody } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { content, subjectId, userId } = body;
    const newMessage = await prisma.message.create({
        data: {
            content: content,
            subjectId: subjectId,
            userId: userId,
        },
    });
    return newMessage;
});