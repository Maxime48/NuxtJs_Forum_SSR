import { PrismaClient } from '@prisma/client';
import { defineEventHandler, readBody } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { title, description } = body;
    const newForum = await prisma.forum.create({
        data: {
            title: title,
            description: description,
        },
    });
    return newForum;
});