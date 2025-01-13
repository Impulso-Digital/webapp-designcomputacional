const express = require("express");
const router = express.Router();
const projetoController = require("../controllers/projetoController");

// Rota para criar um novo projeto
router.post("/", projetoController.createProjeto);

// Rota para listar todos os projetos
router.get("/", projetoController.getProjetos);

module.exports = router;
