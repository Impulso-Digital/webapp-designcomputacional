const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

// Função para criar um novo usuário
const createUser = async (req, res) => {
  try {
    const { nome, nome_usuario, email, senha } = req.body;

    // Verifica se o e-mail já existe no banco de dados
    const userExists = await prisma.user.findUnique({
      where: { email: email },
    });

    if (userExists) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    // Verifica se o nome de usuário já existe no banco de dados
    const nicknameExists = await prisma.user.findUnique({
      where: { nome_usuario: nome_usuario },
    });

    if (nicknameExists) {
      return res.status(400).json({ error: "Nome de usuário já cadastrado" });
    }

    // Cria uma senha segura com bcrypt
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Cria um novo usuário no banco de dados
    const newUser = await prisma.user.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
        nome_usuario,
      },
    });

    // Retorna o usuário cadastrado
    return res.status(201).json({
      message: "Usuário criado com sucesso",
      user: newUser, // Envia os dados do usuário recém-criado
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao criar o usuário" });
  }
};

// Função para login do usuário
const loginUser = async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Verifica se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Compara a senha fornecida com o hash armazenado
    const isPasswordValid = await bcrypt.compare(senha, user.senha);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Credenciais inválidas" });
    }

    // Se a senha for válida, gera um token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET, // Chave secreta armazenada em variáveis de ambiente
      { expiresIn: "1h" }
    );

    // Retorna o token no formato JSON
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro no servidor" });
  }
};

module.exports = { createUser, loginUser };
