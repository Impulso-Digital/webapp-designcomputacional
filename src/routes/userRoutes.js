const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController"); // Certifique-se de que o caminho está correto


// Rota para obter todos os usuários (para teste)
router.get("/", userController.getUsers);

// Rota para criar um novo usuário
router.post("/", (req, res) => {
    console.log("POST request to /api/users");
    userController.createUser(req, res);
});


module.exports = router;
