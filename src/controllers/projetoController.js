const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const authenticateToken = require("../middleware/authenticateToken");

// Configuração do storage para o multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.fieldname === 'thumbnail' ? 'uploads/thumbnails/' : 'uploads/projetos/';
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const fileName = `${Date.now()}-${file.fieldname}${extension}`;
    cb(null, fileName);
  }
});

const upload = multer({ storage: storage });

// Criação de projeto com upload de arquivos
const createProjetoWithFiles = async (req, res) => {
  // Dados do formulário
  const { nome, descricao, tags, codigo, tipoProjeto } = req.body;
  const userId = req.user.id; // ID do usuário logado

  // Validando campos obrigatórios
  if (!nome || !descricao || !tags || !codigo || !tipoProjeto) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  try {
    // Criando o projeto no banco de dados
    const newProjeto = await prisma.projeto.create({
      data: {
        nome,
        descricao,
        tags: Array.isArray(tags) ? tags.join(",") : tags,
        codigo,
        tipoProjeto,
        userId, // Associando o projeto ao usuário
      },
    });

    // Verificando se os arquivos foram recebidos corretamente
    if (!req.files || !req.files.thumbnail || !req.files.projetoFile) {
      // Remover o projeto criado se os arquivos não forem enviados
      await prisma.projeto.delete({
        where: { id: newProjeto.id }
      });
      return res.status(400).json({ error: 'Ambos os arquivos (thumbnail e projeto) são obrigatórios.' });
    }

    // Atualizando o projeto com os arquivos recebidos
    const updatedProjeto = await prisma.projeto.update({
      where: { id: newProjeto.id },
      data: {
        thumbnail: req.files.thumbnail[0].filename,
        projetoFile: req.files.projetoFile[0].filename,
      },
    });

    return res.status(201).json(updatedProjeto);

  } catch (error) {
    console.error('Erro ao criar o projeto com os arquivos:', error);
    return res.status(500).json({ error: 'Erro ao criar o projeto' });
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

    // Formatar os dados dos projetos para incluir as URLs das imagens e arquivos
    res.json({
      projetos: user.projetos.map(projeto => ({
        id: projeto.id,
        nome: projeto.nome,
        descricao: projeto.descricao,
        tags: projeto.tags,
        tipoProjeto: projeto.tipoProjeto,
        thumbnailUrl: projeto.thumbnail ? `/uploads/thumbnails/${projeto.thumbnail}` : null,
        projetoFileUrl: projeto.projetoFile ? `/uploads/projetos/${projeto.projetoFile}` : null,
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

module.exports = { createProjetoWithFiles, getProjetos, getProjetosByUsername, getProjetosByUserId, upload };
