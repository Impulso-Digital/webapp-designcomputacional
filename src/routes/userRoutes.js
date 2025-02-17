const express = require('express');
const { cadastrarUsuario, loginUsuario, logoutUsuario } = require('../controllers/userController'); 
const authenticateToken = require ('../middleware/authenticateToken.js');

const router = express.Router();

// Rota para criar um novo usuário
router.post("/cadastrar", cadastrarUsuario);
router.post("/login" , loginUsuario);
router.post("/logout", authenticateToken, logoutUsuario);


module.exports = router;
