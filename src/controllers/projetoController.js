const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const multer = require('multer');
const path = require('path');

// Configuração do multer para o upload da thumbnail
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/thumbnails'); // Pasta onde as imagens serão armazenadas
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

// Função para cadastrar um novo projeto
const createProjeto = async (req, res) => {
  try {
    const { nome, descricao, tags, codigo } = req.body;

    // Valida os campos obrigatórios
    if (!nome || !descricao || !tags || !codigo) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    // ID do usuário padrão (exemplo)
    const defaultUserId = 1;

    // Processa a thumbnail se houver
    const thumbnail = req.file ? req.file.filename : null;

    // Cria o projeto no banco de dados
    const newProjeto = await prisma.projeto.create({
      data: {
        nome,
        descricao,
        tags,
        codigo,
        thumbnail, // Armazena o nome do arquivo da thumbnail
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

// Listagem de projetos com e sem filtro (tags)
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

module.exports = { createProjeto, getProjetos, upload };
