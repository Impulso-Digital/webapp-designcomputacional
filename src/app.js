const express = require("express");
const session = require('express-session');
const userRoutes = require("./routes/userRoutes");
const projetoRoutes = require("./routes/projetoRoutes");
const path = require("path");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client"); // Importando PrismaClient
const jwt = require('jsonwebtoken'); // Para gerar o token de autenticação
const multer = require("multer");
//const cors = require('cors');
const authenticateToken = require("./auth/authenticateToken"); // Importa o middleware de autenticação

const prisma = new PrismaClient(); // Instância do PrismaClient

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); // Necessário para processar formulários

//app.use(cors({
//    origin: 'http://localhost:3000', // Porta onde o frontend está rodando
//    methods: ['GET', 'POST'],
//  }));

app.use(session({
  secret: 'seu-segredo', // Uma chave secreta para assinar o ID da sessão
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Ajuste para true se estiver usando HTTPS
}));

// Definir a pasta 'public' como a pasta de arquivos estáticos
app.use(express.static(path.join(__dirname, "../public")));

app.get("/test", (req, res) => {
  res.send("Servidor está funcionando!");
});

// Rota principal
app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "../public", "telavisitante.html");
  res.sendFile(filePath);
});

app.get("/src/app.js", (req, res) => {
  res.sendFile(path.join(__dirname, "app.js"));
});

// Rotas de Usuário
app.use("/api/users", userRoutes);
console.log("Rotas de usuários carregadas!");

// Rotas de Projetos
app.use("/api/projetos", projetoRoutes);

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

app.get('/api/projetos/:username', async (req, res) => {
  const username = req.params.username;
  
  try {
      const user = await prisma.user.findUnique({
          where: { nome_usuario: username },
          include: {
              projetos: true,  // Retorna os projetos relacionados ao usuário
          },
      });

      if (!user) {
          return res.status(404).json({ message: "Usuário não encontrado" });
      }

      res.json({
          projetos: user.projetos.map(projeto => ({
              nome: projeto.nome,
              descricao: projeto.descricao,
              tags: projeto.tags,
              thumbnailUrl: `/uploads/${projeto.thumbnail}`, // Supondo que a thumbnail esteja em /uploads
          })),
      });
  } catch (error) {
      res.status(500).json({ message: "Erro ao buscar projetos", error });
  }
});

// Cadastro de projetos
app.use("/api/projetos", projetoRoutes);

app.get('/api/projetos/:username', async (req, res) => {
  const username = req.params.username;
  
  try {
    const user = await prisma.user.findUnique({
      where: { nome_usuario: username },
      include: {
        projetos: true,  // Retorna os projetos relacionados ao usuário
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Retorna apenas os projetos do usuário
    res.json({
      projetos: user.projetos.map(projeto => ({
        nome: projeto.nome,
        descricao: projeto.descricao,
        tags: projeto.tags,
        thumbnailUrl: `/uploads/${projeto.thumbnail}`, // Supondo que a thumbnail esteja em /uploads
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar projetos", error });
  }
});

// Cadastro de projetos
app.post('/projetos', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Você precisa estar logado para criar um projeto' });
  }

  const { nome, descricao, codigo, tags } = req.body;
  const userId = req.session.userId;  // Pega o userId da sessão

  try {
    const novoProjeto = await prisma.projeto.create({
      data: {
        nome,
        descricao,
        codigo,
        tags: tags.join(','), // Caso as tags venham como array
        userId, // Associa o projeto ao usuário logado
      },
    });

    res.status(201).json(novoProjeto);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar o projeto.' });
  }
});

// Rota para Cadastro de Usuário com Prisma

app.post("/api/cadastrar", async (req, res) => {
  console.log("Requisição recebida:", req.body);
  const { nome, nome_usuario, email, senha, confirmPassword } = req.body;

  if (!nome || !nome_usuario || !email || !senha || !confirmPassword) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
  }

  // Verificando se as senhas coincidem
  if (senha !== confirmPassword) {
    return res.status(400).json({ message: "As senhas não coincidem!" });
  }

  try {
    // Verificando se o usuário já existe
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return res.status(400).json({ message: "Este e-mail já está cadastrado!" });
    }

    // Capturando a data/hora atual e ajustando o fuso horário (-3h)
    const now = new Date();
    now.setHours(now.getHours() - 3); // Subtraindo 3 horas

    // Criar usuário no banco de dados
    const novoUsuario = await prisma.user.create({
      data: {
        nome,
        nome_usuario,
        email,
        senha,
        role: 'user',
        createdAt: now,
      },
    });

    // Gerar token de autenticação para o usuário
    const token = jwt.sign(
      { id: novoUsuario.id, nome: novoUsuario.nome, email: novoUsuario.email },
      'seu-segredo',
      { expiresIn: '1h' }
    );

    console.log("Usuário cadastrado:", {
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      nome_usuario: novoUsuario.nome_usuario,
      email: novoUsuario.email,
      role: novoUsuario.role,
      createdAt: now.toISOString(),
    });

    res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
      token,
      user: novoUsuario,
    });

  } catch (err) {
    console.error("Erro ao cadastrar o usuário:", err);
    res.status(500).json({ message: "Erro ao cadastrar o usuário." });
  }
});






// Rota de Login com Prisma
app.post("/api/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: "E-mail e senha são obrigatórios!" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user && user.senha === senha) {
      // Salva o ID do usuário na sessão para rastrear o login
      req.session.userId = user.id;

      console.log("Usuário logado:", {
        id: user.id,
        nome: user.nome,
        nome_usuario: user.nome_usuario,
        email: user.email,
        role: user.role,
      });

      res.status(200).send({ message: "Login bem-sucedido!" });
    } else {
      res.status(401).send({ message: "E-mail ou senha incorretos." });
    }
  } catch (err) {
    console.error("Erro ao fazer login:", err);
    res.status(500).json({ message: "Erro ao fazer login." });
  }
});



app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Erro ao sair');
    }
    res.clearCookie('connect.sid'); // Limpa o cookie da sessão
    res.status(200).json({ message: "Logout bem-sucedido!" });
  });
});


// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
