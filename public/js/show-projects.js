document.addEventListener("DOMContentLoaded", async () => {
  const userId = sessionStorage.getItem("userId");
  const token = localStorage.getItem("token");

  if (!userId || !token) {
      alert('Você precisa estar logado para ver seus projetos.');
      return;
  }

  const username = localStorage.getItem("username");
  console.log("Username recuperado do localStorage:", username);  // Verifique se o valor está correto

  document.getElementById("title").textContent = `PROJETOS DE ${username}`;

  try {
      const response = await fetch(`http://localhost:3000/api/projetos/user/${userId}`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
          }
      });

      if (!response.ok) {
          throw new Error("Erro ao carregar projetos");
      }

      const data = await response.json();

      if (data.projetos && data.projetos.length > 0) {
          const projectsList = document.getElementById("projetos-container");
          projectsList.innerHTML = ''; // Limpa a lista de projetos

          data.projetos
              .filter(projeto => projeto.status === 'aprovado') // Filtra apenas os projetos aprovados
              .forEach(projeto => {
                  // Processa as tags e gera o HTML para exibição
                  const tagsHTML = projeto.tags.length > 0
                      ? projeto.tags.split(',').map(tag => `<span class="tag selected">${tag.trim()}</span>`).join('')
                      : ''; // Não exibe "Sem tags" caso não haja tags

                  // Verifique o valor de projeto.tipoProjeto
                  console.log("Tipo do projeto:", projeto.tipoProjeto);

                  // Corrija a lógica de determinação do tipo de projeto
                  const projectType = projeto.tipoProjeto === 'processing' ? 'Projeto em Processing' : 'Projeto em p5.js';
                  
                  // Usando o caminho completo para a thumbnail
                  const thumbnailUrl = projeto.thumbnail ? projeto.thumbnail : 'default-thumbnail.jpg'; // Fallback para uma imagem padrão

                  const projectItem = document.createElement("div");
                  projectItem.classList.add("projeto");

                  // Adiciona o evento de clique para redirecionar
                  projectItem.addEventListener("click", () => {
                      window.location.href = `TelaProjetoIndividual.html?id=${projeto.id}`;
                  });
                  
                  projectItem.innerHTML = `
                      <div class="thumbnail" style="background-image: url('${thumbnailUrl}')"></div>
                      <div class="info-criador">
                          <div class="foto-perfil"></div>
                          <h3 class="nome-criador">${projeto.nome}</h3>
                          <p class="tipo">${projectType}</p>
                      </div>
                      <p class="descricao">${projeto.descricao}</p>
                      <div class="tags">
                          ${tagsHTML}
                      </div>
                  `;

                  projectsList.appendChild(projectItem);
              });
      } else {
          document.getElementById("projetos-container").innerHTML = "<p>Não há projetos cadastrados.</p>";
      }
  } catch (error) {
      console.error("Erro ao carregar projetos:", error);
      alert("Erro ao carregar projetos.");
  }
});