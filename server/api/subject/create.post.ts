import { PrismaClient } from '@prisma/client';
import { defineEventHandler, readBody } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { title, forumId } = body;
    const newSubject = await prisma.subject.create({
        data: {
            title: title,
            forumId: forumId,
        },
    });
    return newSubject;
});