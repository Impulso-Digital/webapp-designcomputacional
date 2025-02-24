const express = require("express");
const session = require('express-session');  // Se necessário, configurar corretamente
const userRoutes = require("./routes/userRoutes");
const projetoRoutes = require("./routes/projetoRoutes");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const prisma = new PrismaClient();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuração de arquivos estáticos
app.use(express.static(path.join(__dirname, "../public")));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Teste de servidor
app.get("/test", (req, res) => {
  res.send("Servidor está funcionando!");
});

// Rota principal (inicial)
app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "../public", "TelaInicialVisitante.html");
  res.sendFile(filePath);
});

app.get("/src/app.js", (req, res) => {
  res.sendFile(path.join(__dirname, "app.js"));
});

// Rotas de Usuário
app.use("/api", userRoutes);

// Rotas de Projetos
app.use("/api", projetoRoutes);

// Buscar projetos por userId
app.get('/api/projetos/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const projetos = await prisma.projeto.findMany({
      where: { userId: Number(userId) },
    });

    if (projetos.length > 0) {
      res.status(200).json({ projetos });
    } else {
      res.status(404).json({ message: 'Nenhum projeto encontrado.' });
    }
  } catch (err) {
    console.error('Erro ao buscar projetos:', err);
    res.status(500).json({ message: 'Erro ao buscar projetos.' });
  }
});
app.get("/api/projetos/carrossel", async (req, res) => {
  console.log("Requisição recebida em /api/projetos/carrossel"); // Log de depuração
  try {
    const idsFixos = [1, 2, 3, 4];  // IDs fixos, sem conversão extra
    console.log("IDs a serem utilizados na consulta:", idsFixos); // Log de depuração

    // Verifique se estamos fazendo a consulta corretamente com os IDs
    const projetos = await prisma.projeto.findMany({
      where: {
        id: { in: idsFixos },
        status: "aprovado"
      },
      select: {
        id: true,
        nome: true,
        thumbnail: true
      }
    });

    console.log("Projetos encontrados:", projetos); // Log de depuração

    if (projetos.length === 0) {
      return res.status(404).json({ message: "Nenhum projeto encontrado." });
    }

    const projetosFormatados = projetos.map(projeto => ({
      id: projeto.id,
      nome: projeto.nome,
      thumbnailUrl: projeto.thumbnail ? `/uploads/thumbnails/${projeto.thumbnail}` : "/assets/img/default-thumbnail.jpg"
    }));

    res.json(projetosFormatados);  // Retornando os projetos formatados
  } catch (error) {
    console.error("Erro ao buscar projetos do carrossel:", error);
    res.status(500).json({ message: "Erro ao buscar projetos do carrossel" });
  }
});





// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
