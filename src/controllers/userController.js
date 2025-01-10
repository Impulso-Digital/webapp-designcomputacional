const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

// Função para criar um novo usuário
const createUser = async (req, res) => {
    try {
        const { nome, email, senha, role } = req.body;

        // Verifica se o e-mail já existe no banco de dados
        const userExists = await prisma.user.findUnique({
            where: { email: email },
        });

        if (userExists) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }

        // Cria uma senha segura com bcrypt
        const hashedPassword = await bcrypt.hash(senha, 10);

        // Cria um novo usuário no banco de dados
        const newUser = await prisma.user.create({
            data: {
                nome,
                email,
                senha: hashedPassword,
                role,
            },
        });
        return res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao criar o usuário' });
    }
};

// Função para login do usuário
const loginUser = async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Usa a função getUserByEmail para buscar o usuário pelo e-mail
        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Verifica se a senha fornecida é válida comparando com a senha criptografada
        const isPasswordValid = await bcrypt.compare(senha, user.senha);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Gera um token JWT com o ID e role do usuário
        const token = jwt.sign({ userId: user.id, role: user.role }, 'chave', { expiresIn: '1h' });

        // Envia o token para o cliente
        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
};

// Função para buscar um usuário por e-mail
const getUserByEmail = async (email) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email: email }
        });
        return user;
    } catch (error) {
        console.error(error);
        throw new Error('Erro ao buscar usuário');
    }
};

// Função para obter todos os usuários (pode ser útil para debug)
const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
};

module.exports = { getUsers, createUser, loginUser, getUserByEmail };
