const express = require('express');
const userRoutes = require("./routes/userRoutes");
const projetoRoutes = require("./routes/projetoRoutes");  
const path = require("path"); 


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

// Rota de Projetos
app.use("/api/projetos", projetoRoutes); // Define a rota de projetos

app.get("/projetos", async (req, res) => {
    
        const response = await fetch("http://localhost:3000/api/projetos");
        const projetos = await response.json();
        res.render("projetos", { projetos });  // Envia os projetos para a página de visualização
    //Colocar  um try/catch nessa parte caso não encontre projetos 
});

app.get("/cadastro.html", async (req, res) => {
    const filePath = path.join(__dirname, "../public", "cadastro.html");
    res.sendFile(filePath);
});


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    
});



