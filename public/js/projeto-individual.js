document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const projetoId = urlParams.get("id");

  if (!projetoId) {
      alert("ID do projeto não encontrado");
      return;
  }

  try {
      const response = await fetch(`http://localhost:3000/api/projetos/${projetoId}`);
      const projeto = await response.json();

      console.log(projeto); // Verifique se o valor de thumbnailUrl está correto no console

      // Preenche os dados na página
      document.getElementById("titulo-projeto").textContent = projeto.nome;
      document.getElementById("descricao-projeto").textContent = projeto.descricao;
      document.getElementById("nome-usuario").textContent = `Criado por: ${projeto.nomeUsuario}`;
      document.getElementById("foto-perfil").src = projeto.fotoPerfil || "./assets/placeholder_perfil.png";

      // Exibe o código do projeto
      const codigoContainer = document.getElementById("codigo-projeto");
      if (projeto.codigo) {
        codigoContainer.textContent = projeto.codigo;  // Exibe o código do projeto
    } else {
        codigoContainer.textContent = "Código não disponível"; // Caso não haja código
    }

      // Adiciona a thumbnail antes do título
      const thumbnailImg = document.getElementById("thumbnail-projeto");
      if (projeto.thumbnailUrl) {
          let thumbnailUrl = projeto.thumbnailUrl;

          // Verifica se o caminho não começa com '/uploads/thumbnails/' e o corrige
          if (!thumbnailUrl.startsWith('/uploads/thumbnails/')) {
              thumbnailUrl = '/uploads/thumbnails/' + thumbnailUrl.split('/').pop(); // Usa o nome do arquivo e adiciona o prefixo correto
          }

          thumbnailImg.src = thumbnailUrl; // Caminho corrigido da thumbnail
      } else {
          thumbnailImg.style.display = "none";  // Se não houver thumbnail, esconde a imagem
      }

      // Preenche as tags
      const tagsContainer = document.getElementById("tags-container");
      tagsContainer.innerHTML = ""; // Limpa as tags existentes
      const tagsArray = Array.isArray(projeto.tags) ? projeto.tags : (typeof projeto.tags === "string" ? projeto.tags.split(",") : []);
      tagsArray.forEach(tag => {          
          const tagElement = document.createElement("span");
          tagElement.classList.add("tag");
          tagElement.textContent = tag.trim();
          tagsContainer.appendChild(tagElement);
      });

      // Configura o link de download
      const downloadLink = document.getElementById("download-link");
      if (projeto.projetoFile) {
          const fileName = projeto.projetoFile.split("/").pop(); // Obtém o nome do arquivo original
          const fileExtension = fileName.split(".").pop(); // Obtém a extensão do arquivo
          downloadLink.href = `/uploads/projetos/${fileName}`; // Caminho relativo
          downloadLink.download = `${projeto.nome}.${fileExtension}`; // Nome correto com extensão
      } else {
          downloadLink.style.display = "none"; 
      }
  } catch (error) {
      console.error("Erro ao carregar os dados do projeto:", error);
      alert("Erro ao carregar os dados do projeto.");
  }
});
