import { readBody } from 'h3';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = 'cafardJWTSuperSecret';

export const postSignUp = defineEventHandler(async (event) => {
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

// Connexion
export const postSignIn = defineEventHandler(async (event) => {
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