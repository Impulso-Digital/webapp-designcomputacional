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

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
