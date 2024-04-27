import { PrismaClient, Message } from '@prisma/client';
import {defineEventHandler, readBody} from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const {id} = body;
    if (!id) {
        throw new Error('ID is required');
    }
    const subjects = await prisma.subject.findMany({
        where: {
            forumId: Number(id),
        },
    });

    const subjectsWithMessages = await Promise.all(subjects.map(async (subject) => {
        const messages = await prisma.message.findMany({
            where: {
                subjectId: subject.id,
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
    }));

    // Sort subjects by the createdAt of the last message
    subjectsWithMessages.sort((a, b) => {
        if (!a.lastMessage || !b.lastMessage) {
            return 0;
        }

        return b.lastMessage.createdAt.getTime() - a.lastMessage.createdAt.getTime();
    });

    return subjectsWithMessages;
})