document.addEventListener("DOMContentLoaded", async () => {
    const projectsList = document.getElementById("projetos-container");
    
    // Remover a criação do container de paginação
    // const paginationContainer = document.createElement("div");
    // paginationContainer.id = "pagination";
    // document.body.appendChild(paginationContainer);

    async function fetchProjects() {
        try {
            // Remover a parte de paginação na URL
            const response = await fetch(`http://localhost:3000/api/projetos`);
            if (!response.ok) throw new Error("Erro ao carregar projetos");

            const data = await response.json();
            console.log("Dados recebidos da API:", data); // Debug para verificar a resposta

            // Verificando se a resposta contém os projetos corretamente
            if (!data || !data.projetos || !Array.isArray(data.projetos) || data.projetos.length === 0) {
                projectsList.innerHTML = "<p>Não há projetos cadastrados.</p>";
                return;
            }

            const { projetos } = data;

            // Limpa a lista antes de carregar novos projetos
            projectsList.innerHTML = "";

            projetos.forEach(projeto => {
                const tagsHTML = projeto.tags 
                    ? projeto.tags.split(',').map(tag => `<span class="tag selected">${tag.trim()}</span>`).join('')
                    : '';
            
                const projectType = projeto.tipoProjeto === 'Processing' ? 'Projeto em Processing' : 'Projeto em p5.js';
                const thumbnailUrl = projeto.thumbnail || 'default-thumbnail.jpg';
            
                const projectItem = document.createElement("div");
                projectItem.classList.add("projeto");
            
                // Acessando o nome do usuário associado ao projeto
                const nomeCriador = projeto.user ? projeto.user.nome : 'Desconhecido';  // Usando 'Desconhecido' caso não encontre o nome
            
                projectItem.innerHTML = `
                    <div class="thumbnail" style="background-image: url('${thumbnailUrl}')"></div>
                    <div class="info-criador">
                        <h3 class="nome-criador">${nomeCriador}</h3> <!-- Exibe o nome do usuário -->
                        <p class="tipo">${projectType}</p>
                    </div>
                    <p class="descricao">${projeto.descricao}</p>
                    <div class="tags">${tagsHTML}</div>
                `;
                projectItem.addEventListener("click", () => {
                    window.location.href = `TelaProjetoIndividual.html?id=${projeto.id}`;
                });
            
                projectsList.appendChild(projectItem);
            });

        } catch (error) {
            console.error("Erro ao carregar projetos:", error);
            projectsList.innerHTML = "<p>Erro ao carregar projetos.</p>";
        }
    }

    fetchProjects(); // Chama a função para carregar os projetos
});
