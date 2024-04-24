import { PrismaClient } from '@prisma/client';
import { defineEventHandler, readBody } from 'h3';
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { email, password, name } = body;

    // Vérifier si l'email est déjà utilisé
    const existingUser = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });

    if (existingUser) {
        throw new Error('Cet email est déjà utilisé.');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur dans la base de données avec le mot de passe hashé
    const newUser = await prisma.user.create({
        data: {
            email: email,
            password: hashedPassword,
            name: name,
        },
    });

    // Retourner l'utilisateur nouvellement créé
    return {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
    };
});