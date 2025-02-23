document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const projetoId = urlParams.get("id");  // Obtém o ID do projeto da URL

    if (!projetoId) {
        alert("ID do projeto não encontrado");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/projeto/${projetoId}`);
        const projeto = await response.json();

        // Preenche os dados na página
        document.getElementById("nome-projeto").innerText = projeto.nome;
        document.getElementById("nome-usuario").innerText = `Criado por: ${projeto.nomeUsuario}`;
        document.getElementById("foto-perfil").src = projeto.fotoPerfil;
        document.getElementById("thumbnail").src = projeto.thumbnailUrl;
        document.getElementById("descricao-projeto").innerText = projeto.descricao;

        // Preenche as tags
        const tagsContainer = document.querySelector(".tags-container");
        projeto.tags.forEach(tag => {
            const tagElement = document.createElement("span");
            tagElement.classList.add("tag");
            tagElement.innerText = tag;
            tagsContainer.appendChild(tagElement);
        });

        // Configura o link de download
        const downloadBtn = document.getElementById("download-btn");
        if (projeto.projetoFile) {
            downloadBtn.href = projeto.projetoFile;
        } else {
            downloadBtn.style.display = "none";  // Oculta o botão de download se o arquivo não estiver disponível
        }
    } catch (error) {
        console.error("Erro ao carregar os dados do projeto:", error);
    }
});


document.addEventListener("DOMContentLoaded", async () => {
    // Pegando o ID do projeto da URL
    const urlParams = new URLSearchParams(window.location.search);
    const projetoId = urlParams.get("id");
  
    if (!projetoId) {
      alert("Projeto não encontrado.");
      return;
    }
  
    try {
      // Fazendo a requisição para pegar os dados do projeto pelo ID
      const response = await fetch(`http://localhost:3000/api/projetos/${projetoId}`);
  
      if (!response.ok) {
        throw new Error("Erro ao carregar projeto.");
      }
  
      const projeto = await response.json();
  
      // Exibir os dados na tela
      document.getElementById("titulo-projeto").textContent = projeto.nome;
      document.getElementById("descricao-projeto").textContent = projeto.descricao;
      document.getElementById("nome-usuario").textContent = `Criado por: ${projeto.nomeUsuario}`;
      document.getElementById("thumbnail-projeto").src = projeto.thumbnail || "assets/img/default-thumbnail.jpg";
  
      // Link para download do projeto
      document.getElementById("download-link").href = `/uploads/projetos/${projeto.arquivoProjeto}`;
  
      // Exibir tags
      const tagsContainer = document.getElementById("tags-container");
      projeto.tags.split(",").forEach(tag => {
        const span = document.createElement("span");
        span.classList.add("tag");
        span.textContent = tag.trim();
        tagsContainer.appendChild(span);
      });
  
    } catch (error) {
      console.error("Erro ao carregar projeto:", error);
      alert("Erro ao carregar projeto.");
    }
  });
  