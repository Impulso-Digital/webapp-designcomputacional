const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createProjeto = async (req, res) => {
  try {
      const { nome, descricao, codigo } = req.body;

      // Valida os campos obrigatórios
      if (!nome || !descricao || !codigo) {
          return res.status(400).json({ error: "Todos os campos são obrigatórios." });
      }

      // ID do usuário padrão (exemplo)
      const defaultUserId = 1;

      // Cria o projeto com um ID de usuário fixo
      const newProjeto = await prisma.projeto.create({
          data: {
              nome,
              descricao,
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



const getProjetos = async (req, res) => {
    try {
        // Busca todos os projetos no banco de dados
        const projetos = await prisma.projeto.findMany({
            include: {
                user: true, // Inclui os dados do usuário relacionado
            },
        });

        return res.status(200).json(projetos);
    } catch (error) {
        console.error("Erro ao buscar projetos:", error);
        return res.status(500).json({ error: "Erro ao buscar projetos." });
    }
};

module.exports = { createProjeto, getProjetos };
