document.addEventListener("DOMContentLoaded", async () => {
    const projectsList = document.getElementById("projetos-container");

    // Captura o termo de busca da URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search');

    if (!searchTerm) {
        document.getElementById("title").textContent = "Nenhum termo de busca fornecido.";
        projectsList.innerHTML = "<p>Por favor, insira um termo de busca.</p>";
        return;
    }

    // Atualiza o título com o termo de busca
    document.getElementById("title").textContent = `RESULTADO DA BUSCA POR: ${searchTerm}`;

    async function fetchProjects() {
        try {
            // Busca todos os projetos da API
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

            // Filtra os projetos com base no termo de busca (nome do autor ou tags)
            const projetosFiltrados = projetos.filter(projeto => {
                // Verifica se o termo de busca corresponde ao nome do autor
                const autorMatch = projeto.user && projeto.user.nome && projeto.user.nome.toLowerCase().includes(searchTerm.toLowerCase());

                // Verifica se o termo de busca corresponde a uma das tags
                const tagsMatch = projeto.tags && projeto.tags.split(',').some(tag => {
                    const tagNormalizada = tag.trim().toLowerCase();
                    return tagNormalizada.includes(searchTerm.toLowerCase());
                });

                return autorMatch || tagsMatch;
            });

            // Limpa a lista antes de carregar novos projetos
            projectsList.innerHTML = "";

            if (projetosFiltrados.length > 0) {
                projetosFiltrados.forEach(projeto => {
                    // Processa as tags e gera o HTML para exibição
                    const tagsHTML = projeto.tags 
                        ? projeto.tags.split(',').map(tag => `<span class="tag selected">${tag.trim()}</span>`).join('')
                        : '';

                    // Determina o tipo de projeto
                    const projectType = projeto.tipoProjeto === 'Processing' ? 'Projeto em Processing' : 'Projeto em p5.js';

                    // Usa o caminho completo para a thumbnail ou uma imagem padrão
                    const thumbnailUrl = projeto.thumbnail || 'default-thumbnail.jpg';

                    // Cria o elemento do projeto
                    const projectItem = document.createElement("div");
                    projectItem.classList.add("projeto");

                    // Acessando o nome do usuário associado ao projeto
                    const nomeCriador = projeto.user ? projeto.user.nome : 'Desconhecido';  // Usando 'Desconhecido' caso não encontre o nome

                    // Estrutura HTML do projeto
                    projectItem.innerHTML = `
                        <div class="thumbnail" style="background-image: url('${thumbnailUrl}')"></div>
                        <div class="info-criador">
                            <div class="foto-perfil"></div>
                            <h3 class="nome-criador">${nomeCriador}</h3> <!-- Exibe o nome do usuário -->
                            <p class="tipo">${projectType}</p>
                        </div>
                        <p class="descricao">${projeto.descricao}</p>
                        <div class="tags">${tagsHTML}</div>
                    `;

                    // Adiciona o evento de clique para redirecionar
                    projectItem.addEventListener("click", () => {
                        window.location.href = `TelaProjetoIndividual.html?id=${projeto.id}`;
                    });

                    // Adiciona o projeto à lista
                    projectsList.appendChild(projectItem);
                });
            } else {
                projectsList.innerHTML = "<p>Nenhum projeto encontrado para o termo de busca fornecido.</p>";
            }
        } catch (error) {
            console.error("Erro ao carregar projetos:", error);
            projectsList.innerHTML = "<p>Erro ao carregar projetos.</p>";
        }
    }

    fetchProjects(); // Chama a função para carregar os projetos
});