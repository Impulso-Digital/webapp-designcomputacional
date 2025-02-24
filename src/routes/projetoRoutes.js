const express = require('express');
const router = express.Router();
const { createProjetoWithFiles, getProjetos, getUltimosProjetos, getProjetosByUsername, getProjetosByUserId, getProjetoById, getProjetosPendentes, aprovarProjeto } = require('../controllers/projetoController');
const { upload } = require("../middleware/upload"); // Importando o middleware multer para upload de arquivos
const authenticateToken = require("../middleware/authenticateToken");

// Rota para criar projeto com os arquivos (cria o projeto e faz o upload dos arquivos)
router.post("/projetos", authenticateToken, upload, createProjetoWithFiles);

// Rota para listar todos os projetos
router.get("/projetos", getProjetos);


router.get("/ultimos-projetos", getUltimosProjetos); // Nova rota para os últimos projetos


router.get("/projetos/pendentes", authenticateToken, getProjetosPendentes);
router.put("/projetos/aprovar/:id", authenticateToken, aprovarProjeto);

// **Nova Rota para buscar um projeto pelo ID**
router.get("/projetos/:id", getProjetoById);

// Rota para buscar projetos por nome de usuário
router.get("/projetos/usuario/:username", getProjetosByUsername);

// Rota para buscar projetos por ID de usuário
router.get("/projetos/user/:userId", getProjetosByUserId);



module.exports = router;
