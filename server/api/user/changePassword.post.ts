import { PrismaClient } from '@prisma/client';
import { defineEventHandler, readBody } from 'h3';
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { email, password, newPassword } = body;

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });

    if (!user) {
        throw new Error('User not found.');
    }

    // Vérifier si le mot de passe actuel est correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Current password is incorrect.');
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe dans la base de données
    await prisma.user.update({
        where: {
            email: email,
        },
        data: {
            password: hashedPassword,
        },
    });

    // Retourner un message de succès
    return {
        message: 'Password changed successfully',
    };
});