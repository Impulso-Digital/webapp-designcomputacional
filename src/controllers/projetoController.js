const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const multer = require("multer");
const path = require("path");

// Configuração do multer para o upload da thumbnail
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/thumbnails"); // Pasta onde as imagens serão armazenadas
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
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios." });
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
  const query = req.query;
  let projetos;
  try {
    // filtro por tags
    if (query.tags) {
      const tags = query.tags.split(",");
      projetos = await prisma.projeto.findMany({
        where: {
          OR: tags.map((tag) => {
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
    } else {
      // Busca todos os projetos no banco de dados
      projetos = await prisma.projeto.findMany({
        include: {
          user: true, // Inclui os dados do usuário relacionado
        },
      });
    }

    // filtro por busca (APENAS PROJETOS)
    if (query.search) {
      const searchTags = query.search
        .toLowerCase()
        .split("-")
        .filter((tag) => tag.length > 1);
      projetos = projetos.filter((projeto) => {
        for (let tag of searchTags) {
          if (projeto.title.toLowerCase().includes(tag)) {
            return true;
          }
        }
        return false;
      });
    }

    // ordenação dos projetos
    if (query.orderBy) {
      const order = query.orderBy;
      try {
        orderBy(projetos, order);
      } catch (err) {
        res.status(400).send(err.message);
      }
    }

    return res.status(200).json(projetos);
  } catch (error) {
    console.error("Erro ao buscar projetos:", error);
    return res.status(500).json({ error: "Erro ao buscar projetos." });
  }
};

//
// função para ordenar os projetos por título ou data de modificação (POR ORA, DESABILITADO)
// ordenação básica, sem uso de nenhum algoritmo otimizado
function orderBy(projects, order) {
  switch (order) {
    case "title":
    case "title-r":
      projects.sort((a, b) => {
        const titleA = a.title;
        const titleB = b.title;
        if (titleA < titleB) return -1;
        else return 1;
      });
      break;
    /*
    case "modifiedAt":
    case "modifiedAt-r":
      projects.sort((a, b) => {
        const dateA = new Date(a.modifiedAt);
        const dateB = new Date(b.modifiedAt);
        return dateA - dateB;
      });
      break;
      */
    default:
      console.log("Critério de ordenação inexistente.");
      //throw new Error("Critério de ordenação inexistente.");
      return;
  }

  if (order[order.length - 1] === "r") projects.reverse();
}

//

module.exports = { createProjeto, getProjetos, upload };
