import { PrismaClient } from '@prisma/client';
import {defineEventHandler, readBody} from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id;
    if (!id) {
        throw new Error('ID is required');
    }
    const body = await readBody(event);
    const { name } = body;
    const updatedUser = await prisma.user.update({
        where: {
            id: Number(id),
        },
        data: {
            name: name,
        },
    });
    return updatedUser;
});