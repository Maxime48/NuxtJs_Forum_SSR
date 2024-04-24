import { PrismaClient } from '@prisma/client';
import { defineEventHandler, readBody } from 'h3';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = 'cafardJWTSuperSecret';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { email, password } = body;

    // Trouver l'utilisateur par email
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });

    if (!user) {
        throw new Error('Aucun utilisateur trouvé avec cet email.');
    }

    // Vérifier le mot de passe
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        throw new Error('Mot de passe incorrect.');
    }

    // Générer un JWT pour l'utilisateur
    const token = jwt.sign(
        { userId: user.id, email: user.email }, // Payload
        JWT_SECRET,
        { expiresIn: '24h' } // Options
    );

    // Optionnellement, vous pouvez envoyer le token dans un cookie HTTPS sécurisé
    setCookie(event, 'authToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 // 24 heures
    });

    return {
        message: "Connexion réussie",
        token, // Renvoyer le token au client
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
        },
    };
});