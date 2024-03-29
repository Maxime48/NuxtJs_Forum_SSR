import { defineEventHandler, useBody } from 'h3';
import {PrismaClient} from "@prisma/client/extension";

const prisma = new PrismaClient();

export const postSignUp = defineEventHandler(async (event) => {
    const body = await useBody(event);
    const { email, password, name } = body;

    // Ajoutez ici la logique de création d'utilisateur, assurez-vous de hasher le mot de passe
});

// Connexion
export const postSignIn = defineEventHandler(async (event) => {
    const body = await useBody(event);
    const { email, password } = body;

    // Ajoutez ici la logique pour vérifier l'email et le mot de passe
});
