const { PrismaClient } = require('@prisma/client');

const clearDatabase = async () => {
    const prisma = new PrismaClient();
    try {
        // Apagar todos os projetos
        await prisma.projeto.deleteMany();
        console.log("Todos os projetos foram apagados.");

        // Apagar todos os usuários
        await prisma.user.deleteMany();
        console.log("Todos os usuários foram apagados.");

        console.log("Banco de dados limpo com sucesso.");
    } catch (error) {
        console.error("Erro ao limpar o banco de dados:", error);
    } finally {
        await prisma.$disconnect();
    }
};

// Executa o script
clearDatabase();
