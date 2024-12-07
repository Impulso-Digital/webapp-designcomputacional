const express = require('express');
const userRoutes = require("./routes/userRoutes");
const projetoRoutes = require("./routes/projetoRoutes");  
const path = require("path"); // Importando o módulo path


const app = express();
const PORT = 3000;


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware para interpretar JSON
app.use(express.json());

app.get("/test", (req, res) => {
    res.send("Servidor está funcionando!");
});
// Rota principal
app.get("/", (req, res) => {
    res.send("Bem-vindo à página inicial!");
});

// Rotas de Usuário
app.use("/api/users", userRoutes);
console.log("Rotas de usuários carregadas!");

// Rota de Projetos
app.use("/api/projetos", projetoRoutes); // Define a rota de projetos

app.get("/projetos", async (req, res) => {
    try {
        const response = await fetch("http://localhost:3000/api/projetos");
        const projetos = await response.json();
        res.render("projetos", { projetos });  // Envia os projetos para a página de visualização
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao carregar os projetos.");
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    
});



