import {PrismaClient} from "@prisma/client";
import { defineEventHandler, readBody } from 'h3';

const prisma = new PrismaClient();

export const createMessage = async (content: string, subjectId: number, userId: number) => {
    const newMessage = await prisma.message.create({
        data: {
            content: content,
            subjectId: subjectId,
            userId: userId,
        },
    });
    return newMessage;
};

export const getMessage = async (id: number) => {
    const message = await prisma.message.findUnique({
        where: {
            id: id,
        },
    });
    return message;
};

export const updateMessage = async (id: number, content: string) => {
    const updatedMessage = await prisma.message.update({
        where: {
            id: id,
        },
        data: {
            content: content,
        },
    });
    return updatedMessage;
};

export const deleteMessage = async (id: number) => {
    const deletedMessage = await prisma.message.delete({
        where: {
            id: id,
        },
    });
    return deletedMessage;
};

export const createMessageHandler = defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { content, subjectId, userId } = body;
    const newMessage = await createMessage(content, subjectId, userId);
    return newMessage;
});

export const getMessageHandler = defineEventHandler(async (event) => {
    const id = event.context.params?.id;
    if (!id) {
        throw new Error('ID is required');
    }
    const message = await getMessage(Number(id));
    return message;
});

export const updateMessageHandler = defineEventHandler(async (event) => {
    const id = event.context.params?.id;
    if (!id) {
        throw new Error('ID is required');
    }
    const body = await readBody(event);
    const { content } = body;
    const updatedMessage = await updateMessage(Number(id), content);
    return updatedMessage;
});

export const deleteMessageHandler = defineEventHandler(async (event) => {
    const id = event.context.params?.id;
    if (!id) {
        throw new Error('ID is required');
    }
    const deletedMessage = await deleteMessage(Number(id));
    return deletedMessage;
});