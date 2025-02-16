const express = require("express");
const session = require('express-session');
const userRoutes = require("./routes/userRoutes");
const projetoRoutes = require("./routes/projetoRoutes");
const path = require("path");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client"); // Importando PrismaClient
const jwt = require('jsonwebtoken'); // Para gerar o token de autenticação
const multer = require("multer");
const { cadastrarUsuario, loginUsuario, logoutUsuario } = require("./controllers/userController");
//const cors = require('cors');

const prisma = new PrismaClient(); // Instância do PrismaClient

const app = express();
const PORT = 3000;


//Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); // Necessário para processar formulários


// Definir a pasta 'public' como a pasta de arquivos estáticos
app.use(express.static(path.join(__dirname, "../public")));

app.get("/test", (req, res) => {
  res.send("Servidor está funcionando!");
});

// Rota principal
app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "../public", "TelaInicialVisitante.html");
  res.sendFile(filePath);
});

app.get("/src/app.js", (req, res) => {
  res.sendFile(path.join(__dirname, "app.js"));
});




// Configuração do multer para uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Pasta onde as imagens serão salvas
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nome único para cada arquivo
  }
});

const upload = multer({ storage });



// Rotas de Usuário
app.use("/api", userRoutes);

// Rotas de Projetos
app.use("/api", projetoRoutes);



app.get('/api/projetos/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
      const projetos = await prisma.projeto.findMany({
          where: { userId: Number(userId) }
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
