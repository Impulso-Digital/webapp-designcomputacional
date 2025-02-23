const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

// Cadastrar Usuário
const cadastrarUsuario = async (req, res) => {
  console.log("Requisição recebida:", req.body);
  const { nome, nome_usuario, email, senha, confirmPassword } = req.body;

  if (!nome || !nome_usuario || !email || !senha || !confirmPassword) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
  }

  if (senha !== confirmPassword) {
    return res.status(400).json({ message: "As senhas não coincidem!" });
  }

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
      return res.status(400).json({ message: "Este e-mail já está cadastrado!" });
    }

    // Criptografar a senha antes de salvar no banco
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    // Verifica se o arquivo de foto de perfil foi enviado
    const fotoPerfilPath = req.files && req.files['fotoPerfil'] ? req.files['fotoPerfil'][0].path : null;
    const now = new Date();
    now.setHours(now.getHours() - 3);

    // Cria o usuário no banco de dados
    const novoUsuario = await prisma.user.create({
      data: {
        nome,
        nome_usuario,
        email,
        senha: senhaHash,
        role: 'user',
        foto_perfil: fotoPerfilPath, // Salva o caminho da foto de perfil
        createdAt: now,
      },
    });

    // Gera o token JWT
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
      foto_perfil: novoUsuario.foto_perfil,
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
};




// Login de Usuário
const loginUsuario = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: "E-mail e senha são obrigatórios!" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user && await bcrypt.compare(senha, user.senha)) { // Comparação segura
      const token = jwt.sign(
        { id: user.id, nome: user.nome, nome_usuario: user.nome_usuario, email: user.email },
        process.env.JWT_SECRET, // Agora está consistente
        { expiresIn: "1h" }
      );

      console.log("Usuário logado:", {
        id: user.id,
        nome: user.nome,
        nome_usuario: user.nome_usuario,
        email: user.email,
        role: user.role,
      });

      res.status(200).json({
        message: "Login bem-sucedido!",
        token,
        userId: user.id,
      });
    } else {
      res.status(401).json({ message: "E-mail ou senha incorretos." });
    }
  } catch (err) {
    console.error("Erro ao fazer login:", err);
    res.status(500).json({ message: "Erro ao fazer login." });
  }
};




// Logout
const logoutUsuario = async (req, res) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (token) {
    try {
      await prisma.tokenBlacklist.create({
        data: { token },
      });

      return res.status(200).json({ message: "Logout realizado com sucesso" });
    } catch (error) {
      console.error("Erro ao revogar o token:", error);
      return res.status(500).json({ message: "Erro ao revogar o token" });
    }
  }
  res.status(400).json({ message: "Token não fornecido" });
};

module.exports = { cadastrarUsuario, loginUsuario, logoutUsuario };

