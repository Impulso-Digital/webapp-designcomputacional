const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const userController = require('../controllers/userController'); 

// Rota para criar um novo usuário
router.post("/", userController.createUser); // Aqui é direto, sem a necessidade de envolver em função anônima


// Rota de login para autenticação
router.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Verifica se o usuário existe
        const user = await userController.getUserByEmail(email);

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Compara a senha fornecida com o hash armazenado
        const isPasswordValid = await bcrypt.compare(senha, user.senha);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Credenciais inválidas' });
        }

        // Se a senha for válida, gera um token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            'chave', // 
            { expiresIn: '1h' }
        );

        // Retorna o token no formato JSON
        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
});

module.exports = router;
