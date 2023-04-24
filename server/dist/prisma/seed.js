import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    // Create a user with a chat
    const newUser = await prisma.user.create({
        data: {
            email: 'test@example.com',
            username: 'testuser',
            chats: {
                create: {
                    body: 'This is the first chat I created.',
                },
            },
        },
        include: {
            chats: true,
        },
    });
    console.log('Created new user with a chat:', newUser);
}
main()
    .catch((error) => {
    console.error(error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map