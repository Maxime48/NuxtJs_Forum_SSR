import { PrismaClient } from '@prisma/client';
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
        include: {
            messages: {
                orderBy: {
                    createdAt: 'desc'
                },
                take: 1,
                select: {
                    content: true,
                    createdAt: true,
                    user: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        },
    });

    // Sort subjects by the createdAt of the last message
    subjects.sort((a, b) => {
        const aLastMessage = a.messages[0];
        const bLastMessage = b.messages[0];

        if (!aLastMessage || !bLastMessage) {
            return 0;
        }

        return bLastMessage.createdAt.getTime() - aLastMessage.createdAt.getTime();
    });

    return subjects;
})