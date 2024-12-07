const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createUser = async (req, res) => {
    console.log("Requisição recebida:", req.body);  // Adicionando um log para depuração

    try {
        const { nome, email, senha, role } = req.body;

        // Verifica se o e-mail já existe no banco de dados
        const userExists = await prisma.user.findUnique({
            where: { email: email },
        });

        if (userExists) {
            return res.status(400).json({ error: "Email já cadastrado" });
        }

        // Cria um novo usuário
        const newUser = await prisma.user.create({
            data: {
                nome,
                email,
                senha, 
                role,
            },
        });

        return res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao criar o usuário" });
    }
};

const getUsers = async (req, res) => {
    try {
        // Busca todos os usuários no banco de dados
        const users = await prisma.user.findMany();
        
        // Se encontrar usuários, retorna a lista
        res.status(200).json(users);
    } catch (error) {
        console.error(error);  
        res.status(500).json({ error: "Erro ao buscar usuários" });
    }
};

module.exports = { getUsers, createUser };
