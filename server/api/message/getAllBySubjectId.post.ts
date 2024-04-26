import { PrismaClient } from '@prisma/client';
import {defineEventHandler, readBody} from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { id } = body;
    if (!id) {
        throw new Error('ID is required');
    }
    const message = await prisma.message.findMany({
        where: {
            subjectId: Number(id),
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                }
            }
        },
    });
    return message;
});