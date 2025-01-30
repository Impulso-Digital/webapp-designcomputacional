const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createProjeto = async (req, res) => {
  try {
    const { nome, descricao, tags, codigo } = req.body;

    // Valida os campos obrigatórios
    if (!nome || !descricao || !tags || !codigo) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios." });
    }

    // ID do usuário padrão (exemplo)
    const defaultUserId = 1;

    // Cria o projeto com um ID de usuário fixo
    const newProjeto = await prisma.projeto.create({
      data: {
        nome,
        descricao,
        tags,
        codigo,
        userId: defaultUserId,
      },
    });
    console.log("Projeto cadastrado com sucesso:", newProjeto);

    return res.status(201).json(newProjeto);
  } catch (error) {
    console.error("Erro ao criar o projeto:", error);
    return res.status(500).json({ error: "Erro ao criar o projeto." });
  }
};

// listagem de projetos com e sem filtro (tags)
const getProjetos = async (req, res) => {
  try {
    if (req.query.tags) {
      const tags = req.query.tags.split(",");
      const projetos = await prisma.projeto.findMany({
        where: {
          AND: tags.map((tag) => {
            return {
              tags: {
                contains: tag,
              },
            };
          }),
        },
        include: {
          user: true,
        },
      });

      return res.status(200).json(projetos);
    } else {
      // Busca todos os projetos no banco de dados
      const projetos = await prisma.projeto.findMany({
        include: {
          user: true, // Inclui os dados do usuário relacionado
        },
      });
      return res.status(200).json(projetos);
    }
  } catch (error) {
    console.error("Erro ao buscar projetos:", error);
    return res.status(500).json({ error: "Erro ao buscar projetos." });
  }
};

module.exports = { createProjeto, getProjetos };
