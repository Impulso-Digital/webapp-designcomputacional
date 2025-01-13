const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const resetSequences = async () => {
    try {
        // Reinicia a sequência para a tabela "User"
        await prisma.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1`;
        
        // Reinicia a sequência para a tabela "Projeto"
        await prisma.$executeRaw`ALTER SEQUENCE "Projeto_id_seq" RESTART WITH 1`;

        console.log("Sequências de ID redefinidas com sucesso!");
    } catch (error) {
        console.error("Erro ao redefinir as sequências:", error);
    } finally {
        await prisma.$disconnect();
    }
};

resetSequences();
