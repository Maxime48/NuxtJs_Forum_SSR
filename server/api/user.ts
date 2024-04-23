import {PrismaClient} from "@prisma/client";
import { defineEventHandler, readBody } from 'h3';

const prisma = new PrismaClient();

export const getUser = async (id: number) => {
    const user = await prisma.user.findUnique({
        where: {
            id: id,
        },
    });
    return user;
};

export const updateUser = async (id: number, name: string) => {
    const updatedUser = await prisma.user.update({
        where: {
            id: id,
        },
        data: {
            name: name,
        },
    });
    return updatedUser;
};

export const deleteUser = async (id: number) => {
    const deletedUser = await prisma.user.delete({
        where: {
            id: id,
        },
    });
    return deletedUser;
};

export const getUserHandler = defineEventHandler(async (event) => {
    const id = event.context.params?.id;
    if (!id) {
        throw new Error('ID is required');
    }
    const user = await getUser(Number(id));
    return user;
});

export const updateUserHandler = defineEventHandler(async (event) => {
    const id = event.context.params?.id;
    if (!id) {
        throw new Error('ID is required');
    }
    const body = await readBody(event);
    const { name } = body;
    const updatedUser = await updateUser(Number(id), name);
    return updatedUser;
});

export const deleteUserHandler = defineEventHandler(async (event) => {
    const id = event.context.params?.id;
    if (!id) {
        throw new Error('ID is required');
    }
    const deletedUser = await deleteUser(Number(id));
    return deletedUser;
});