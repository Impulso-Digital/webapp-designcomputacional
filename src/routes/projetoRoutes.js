const express = require('express');
const router = express.Router();
const { createProjetoWithFiles, getProjetos, getProjetosByUsername, getProjetosByUserId } = require('../controllers/projetoController');
const { upload } = require("../middleware/upload"); // Importando o middleware multer para upload de arquivos
const authenticateToken = require("../middleware/authenticateToken");

// Rota para criar projeto com os arquivos (cria o projeto e faz o upload dos arquivos)
router.post("/projetos", authenticateToken, upload, createProjetoWithFiles);

// Rota para listar todos os projetos
router.get("/projetos", getProjetos);

// Rota para buscar projetos por nome de usuário
router.get("/projetos/usuario/:username", getProjetosByUsername);

// Rota para buscar projetos por ID de usuário
router.get("/projetos/user/:userId", getProjetosByUserId);

module.exports = router;
