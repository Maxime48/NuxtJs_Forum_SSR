import { PrismaClient, Message } from '@prisma/client';
import {defineEventHandler, readBody} from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { id } = body;
    if (!id) {
        throw new Error('ID is required');
    }
    const subject = await prisma.subject.findUnique({
        where: {
            id: Number(id),
        },
    });

    const messages = await prisma.message.findMany({
        where: {
            subjectId: Number(id),
        },
        orderBy: {
            createdAt: 'asc'
        },
        include: {
            user: true
        }
    });

    const firstMessage = messages[0];
    const lastMessage = messages[messages.length - 1];

    return { ...subject, firstMessage, lastMessage };
});