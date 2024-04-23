import {PrismaClient} from "@prisma/client";
import { defineEventHandler, readBody } from 'h3';

const prisma = new PrismaClient();

export const createSubject = async (title: string, forumId: number) => {
    const newSubject = await prisma.subject.create({
        data: {
            title: title,
            forumId: forumId,
        },
    });
    return newSubject;
};

export const getSubject = async (id: number) => {
    const subject = await prisma.subject.findUnique({
        where: {
            id: id,
        },
    });
    return subject;
};

export const updateSubject = async (id: number, title: string) => {
    const updatedSubject = await prisma.subject.update({
        where: {
            id: id,
        },
        data: {
            title: title,
        },
    });
    return updatedSubject;
};

export const deleteSubject = async (id: number) => {
    const deletedSubject = await prisma.subject.delete({
        where: {
            id: id,
        },
    });
    return deletedSubject;
};

export const createSubjectHandler = defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { title, forumId } = body;
    const newSubject = await createSubject(title, forumId);
    return newSubject;
});

export const getSubjectHandler = defineEventHandler(async (event) => {
    const id = event.context.params?.id;
    if (!id) {
        throw new Error('ID is required');
    }
    const subject = await getSubject(Number(id));
    return subject;
});

export const updateSubjectHandler = defineEventHandler(async (event) => {
    const id = event.context.params?.id;
    if (!id) {
        throw new Error('ID is required');
    }
    const body = await readBody(event);
    const { title } = body;
    const updatedSubject = await updateSubject(Number(id), title);
    return updatedSubject;
});

export const deleteSubjectHandler = defineEventHandler(async (event) => {
    const id = event.context.params?.id;
    if (!id) {
        throw new Error('ID is required');
    }
    const deletedSubject = await deleteSubject(Number(id));
    return deletedSubject;
});