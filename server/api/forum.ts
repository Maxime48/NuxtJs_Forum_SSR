import {PrismaClient} from "@prisma/client";
import { defineEventHandler, readBody } from 'h3';

const prisma = new PrismaClient();

export const createForum = async (title: string, description: string) => {
    const newForum = await prisma.forum.create({
        data: {
            title: title,
            description: description,
        },
    });
    return newForum;
};

export const getForum = async (id: number) => {
    const forum = await prisma.forum.findUnique({
        where: {
            id: id,
        },
    });
    return forum;
};

export const updateForum = async (id: number, title: string, description: string) => {
    const updatedForum = await prisma.forum.update({
        where: {
            id: id,
        },
        data: {
            title: title,
            description: description,
        },
    });
    return updatedForum;
};

export const deleteForum = async (id: number) => {
    const deletedForum = await prisma.forum.delete({
        where: {
            id: id,
        },
    });
    return deletedForum;
};

// Define event handlers for API routes
export const getForumsHandler = defineEventHandler(async () => {
    const forums = await prisma.forum.findMany();
    return forums;
});

export const getForumHandler = defineEventHandler(async (event) => {
    const id = event.context.params?.id;
    if (!id) {
        throw new Error('ID is required');
    }
    const forum = await getForum(Number(id));
    return forum;
});

export const createForumHandler = defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { title, description } = body;
    const newForum = await createForum(title, description);
    return newForum;
});

export const updateForumHandler = defineEventHandler(async (event) => {
    const id = event.context.params?.id;
    if (!id) {
        throw new Error('ID is required');
    }
    const body = await readBody(event);
    const { title, description } = body;
    const updatedForum = await updateForum(Number(id), title, description);
    return updatedForum;
});

export const deleteForumHandler = defineEventHandler(async (event) => {
    const id = event.context.params?.id;
    if (!id) {
        throw new Error('ID is required');
    }
    const deletedForum = await deleteForum(Number(id));
    return deletedForum;
});
