const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const multer = require("multer");
const path = require("path");
const authenticateToken = require("../auth/authenticateToken");

// Configuração do multer para upload de thumbnails
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/thumbnails");
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });

// Cadastrar um novo projeto
const createProjeto = async (req, res) => {
  try {
    const { nome, descricao, tags, codigo } = req.body;
    const userId = req.user.id;

    if (!nome || !descricao || !tags || !codigo) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    const thumbnail = req.file ? req.file.filename : null;

    const newProjeto = await prisma.projeto.create({
      data: {
        nome,
        descricao,
        tags: Array.isArray(tags) ? tags.join(",") : tags,
        codigo,
        thumbnail,
        userId,
      },
    });

    console.log("Projeto cadastrado com sucesso:", newProjeto);
    return res.status(201).json(newProjeto);
  } catch (error) {
    console.error("Erro ao criar o projeto:", error);
    return res.status(500).json({ error: "Erro ao criar o projeto." });
  }
};

// Buscar projetos por nome de usuário
const getProjetosByUsername = async (req, res) => {
  const username = req.params.username;
  try {
    const user = await prisma.user.findUnique({
      where: { nome_usuario: username },
      include: { projetos: true },
    });
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
    res.json({
      projetos: user.projetos.map(projeto => ({
        id: projeto.id,
        nome: projeto.nome,
        descricao: projeto.descricao,
        tags: projeto.tags,
        thumbnailUrl: projeto.thumbnail ? `/uploads/thumbnails/${projeto.thumbnail}` : null,
      })),
    });
  } catch (error) {
    console.error("Erro ao buscar projetos:", error);
    res.status(500).json({ message: "Erro ao buscar projetos" });
  }
};

// Buscar projetos por ID do usuário
const getProjetosByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const projetos = await prisma.projeto.findMany({ where: { userId: Number(userId) } });
    return projetos.length > 0 ? res.status(200).json({ projetos }) : res.status(404).json({ message: "Nenhum projeto encontrado." });
  } catch (error) {
    console.error("Erro ao buscar projetos:", error);
    res.status(500).json({ message: "Erro ao buscar projetos." });
  }
};

// Listagem de projetos com filtros (tags, busca e ordenação)
const getProjetos = async (req, res) => {
  const { tags, search, orderBy } = req.query;
  let projetos;
  try {
    const filtros = {};
    if (tags) {
      filtros.OR = tags.split(",").map(tag => ({ tags: { contains: tag } }));
    }
    projetos = await prisma.projeto.findMany({ where: filtros, include: { user: true } });
    if (search) {
      const searchTags = search.toLowerCase().split("-").filter(tag => tag.length > 1);
      projetos = projetos.filter(projeto => searchTags.some(tag => projeto.nome.toLowerCase().includes(tag)));
    }
    if (orderBy) {
      projetos.sort((a, b) => {
        if (orderBy === "title") return a.nome.localeCompare(b.nome);
        if (orderBy === "title-r") return b.nome.localeCompare(a.nome);
        if (orderBy === "modifiedAt") return new Date(a.updatedAt) - new Date(b.updatedAt);
        if (orderBy === "modifiedAt-r") return new Date(b.updatedAt) - new Date(a.updatedAt);
        return 0;
      });
    }
    return res.status(200).json(projetos);
  } catch (error) {
    console.error("Erro ao buscar projetos:", error);
    return res.status(500).json({ error: "Erro ao buscar projetos." });
  }
};

module.exports = { createProjeto, getProjetos, getProjetosByUsername, getProjetosByUserId, upload };
