

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createProjeto = async (req, res) => {
  try {
    const { nome, descricao, codigo, userId } = req.body;

    const parsedUserId = parseInt(userId, 10);


    // Cria um novo projeto
    const newProjeto = await prisma.projeto.create({
      data: {
        nome,
        descricao,
        codigo,
        userId, parsedUserId,  // O id do professor ou monitor que está criando o projeto
      },
    });

    return res.status(201).json(newProjeto);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao criar o projeto" });
  }
};

const getProjetos = async (req, res) => {
    try {  
      // Busca todos os projetos no banco de dados
      const projetos = await prisma.projeto.findMany({
        include: {
          user: true,  // Inclui dados do usuário que criou o projeto
        },
      });
  
      return res.status(200).json(projetos);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar projetos" });
    }
  };
  
  module.exports = { createProjeto, getProjetos };
  




