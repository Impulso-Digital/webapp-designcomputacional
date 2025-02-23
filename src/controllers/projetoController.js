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
        status: "pendente",
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

    // Caminhos completos para os arquivos
    const thumbnailPath = `/uploads/thumbnails/${req.files.thumbnail[0].filename}`;
    const projetoFilePath = `/uploads/projetos/${req.files.projetoFile[0].filename}`;

    // Atualizando o projeto com os arquivos recebidos
    const updatedProjeto = await prisma.projeto.update({
      where: { id: newProjeto.id },
      data: {
        thumbnail: thumbnailPath,
        projetoFile: projetoFilePath,
      },
    });

    return res.status(201).json(updatedProjeto);

  } catch (error) {
    console.error('Erro ao criar o projeto com os arquivos:', error);
    return res.status(500).json({ error: 'Erro ao criar o projeto' });
  }
};

const getProjetosPendentes = async (req, res) => {
  try {
      const projetos = await prisma.projeto.findMany({
          where: { status: "pendente" },
          include: { user: { select: { nome: true } } }
      });

      if (!projetos || projetos.length === 0) {
          return res.json([]); // Retorna um array vazio ao invés de `null`
      }

      res.json(projetos);
  } catch (error) {
      console.error("Erro ao buscar projetos pendentes:", error);
      res.status(500).json({ message: "Erro ao buscar projetos pendentes" });
  }
};



const aprovarProjeto = async (req, res) => {
  const { id } = req.params;

  try {
      await prisma.projeto.update({
          where: { id: parseInt(id) },
          data: { status: "aprovado" }
      });

      res.json({ message: "Projeto aprovado!" });
  } catch (error) {
      console.error("Erro ao aprovar projeto:", error);
      res.status(500).json({ message: "Erro ao aprovar projeto" });
  }
};

const getUltimosProjetos = async (req, res) => {
  try {
      const projetos = await prisma.projeto.findMany({
          where: {status: "aprovado"},
          orderBy: { createdAt: "desc" }, // Ordena do mais recente para o mais antigo
          take: 6, // Limita a 6 projetos
          include: {
              user: { // Associe os dados do usuário
                  select: { nome: true, foto_perfil: true } // Obtém o nome e a foto de perfil do usuário
              }
          }
      });

      // Formatar os projetos para o frontend
      const projetosFormatados = projetos.map(projeto => {
          console.log(projeto.user?.foto_perfil); // Agora dentro do map, onde "projeto" está disponível

          return {
              id: projeto.id,
              nome: projeto.nome,
              descricao: projeto.descricao,
              thumbnailUrl: projeto.thumbnail || "assets/img/default-thumbnail.jpg",
              nomeUsuario: projeto.user?.nome || "Usuário Desconhecido",
              // Se a foto de perfil existir, cria a URL completa, senão usa uma foto padrão
              fotoPerfil: projeto.user?.foto_perfil ? `/uploads/fotosPerfil/${projeto.user.foto_perfil}` : "assets/img/default-user.jpg",
              tags: projeto.tags ? projeto.tags.split(",") : []
          };
      });

      res.json(projetosFormatados);
  } catch (error) {
      console.error("Erro ao buscar os últimos projetos:", error);
      res.status(500).json({ message: "Erro ao buscar projetos" });
  }
};

const getProjetoById = async (req, res) => {
  const { id } = req.params; // Obtém o ID do projeto da URL

  console.log("ID recebido:", id); // 👈 Verifica se o ID está chegando corretamente

  try {
      const projeto = await prisma.projeto.findUnique({
          where: { id: parseInt(id) }, // Converte para número
          include: {
              user: { // Inclui dados do usuário criador
                  select: { nome: true, foto_perfil: true }
              }
          }
      });

      if (!projeto) {
          return res.status(404).json({ message: "Projeto não encontrado" });
      }

      res.json({
          id: projeto.id,
          nome: projeto.nome,
          descricao: projeto.descricao,
          thumbnailUrl: projeto.thumbnail ? `/uploads/projetos/${projeto.thumbnail}` : "/assets/img/default-thumbnail.jpg",
          nomeUsuario: projeto.user?.nome || "Usuário Desconhecido",
          fotoPerfil: projeto.user?.foto_perfil ? `/uploads/fotosPerfil/${projeto.user.foto_perfil}` : "/assets/img/default-user.jpg",
          tags: projeto.tags ? projeto.tags.split(",") : [],
          projetoFile: projeto.projetoFile ? `/uploads/projetos/${projeto.projetoFile}` : null
      });
  } catch (error) {
      console.error("Erro ao buscar projeto:", error);
      res.status(500).json({ message: "Erro ao buscar projeto" });
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
      const projetos = await prisma.projeto.findMany({ 
          where: { 
              userId: Number(userId),
              status: "aprovado" // Filtra os projetos aprovados aqui
          }
      });

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
    where: {status: "aprovado"}

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

module.exports = { createProjetoWithFiles, getProjetos, getProjetosByUsername, getProjetosByUserId, upload, getUltimosProjetos, getProjetoById, getProjetosPendentes, aprovarProjeto  };
