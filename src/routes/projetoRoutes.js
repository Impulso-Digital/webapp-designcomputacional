const express = require('express');
const router = express.Router();
const { createProjeto, getProjetos, getProjetosByUsername, getProjetosByUserId, upload} = require('../controllers/projetoController');
const authenticateToken = require ("../auth/authenticateToken");

router.post("/projetos", authenticateToken, upload.single("thumbnail"), createProjeto);
router.get("/projetos", getProjetos);
router.get("/projetos/usuario/:username", getProjetosByUsername);
router.get("/projetos/user/:userId", getProjetosByUserId);

module.exports = router;
