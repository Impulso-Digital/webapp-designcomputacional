const express = require('express');
const userRoutes = require("./routes/userRoutes");
const projetoRoutes = require("./routes/projetoRoutes");  
const path = require("path");
const authenticateToken = require("./auth/authenticateToken");  // Importa o middleware de autenticação

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());

// Definir a pasta 'public' como a pasta de arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

app.get("/test", (req, res) => {
    res.send("Servidor está funcionando!");
});

// Rota principal
app.get("/", (req, res) => {
    const filePath = path.join(__dirname, '../public', 'index.html');
    res.sendFile(filePath);
});

// Rotas de Usuário
app.use("/api/users", userRoutes);
console.log("Rotas de usuários carregadas!");

// Rotas de Projetos - Protegendo a rota de projetos com o middleware de autenticação
app.use("/api/projetos", projetoRoutes); // Agora a rota de projetos exige um token

app.get("/projetos", async (req, res) => {
    try {
        const response = await fetch("http://localhost:3000/api/projetos");
        const projetos = await response.json();
        res.render("projetos", { projetos });  // Envia os projetos para a página de visualização
    } catch (error) {
        console.error("Erro ao carregar projetos:", error);
        res.status(500).send("Erro ao carregar projetos.");
    }
});

app.get("/cadastro", async (req, res) => {
    const filePath = path.join(__dirname, "../public", "cadastro.html");
    res.sendFile(filePath);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
