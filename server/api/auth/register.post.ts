import { PrismaClient } from '@prisma/client';
import { defineEventHandler, readBody } from 'h3';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = 'cafardJWTSuperSecret';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { email, password, name } = body;

    // Vérifier si le paramètres sont fournis
    if (!email || !password || !name) {
        throw new Error('Veuillez fournir un email, un mot de passe et un nom.');
    }

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

    // Générer un JWT pour l'utilisateur
    const token = jwt.sign(
        { userId: newUser.id, email: newUser.email }, // Payload
        JWT_SECRET,
        { expiresIn: '24h' } // Options
    );

    // Retourner l'utilisateur nouvellement créé
    return {
        message: "Enregistrement réussi",
        token, // Renvoyer le token au client
        user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
        },
    };
});