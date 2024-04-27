import {PrismaClient} from '@prisma/client';
import {execSync} from 'child_process';
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

try {
    execSync('npx prisma migrate dev --preview-feature', {stdio: 'inherit'});
} catch (error) {
    console.error('Error running prisma migrate:', error);
    process.exit(1);
}

const existingAdmin = await prisma.user.findFirst({
    where: {
        Admin: true,
    },
});
if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin', 10);

    await prisma.user.create({
        data: {
            email: 'admin',
            password: hashedPassword,
            name: 'Admin',
            Admin: true,
        },
    });

    console.log('Admin account created');
}
