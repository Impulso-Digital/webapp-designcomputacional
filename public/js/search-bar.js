document.addEventListener("DOMContentLoaded", () => {
    console.log("Script carregado. Verificando elementos...");

    const projectsList = document.getElementById("projetos-container");

    if (!projectsList) {
        console.error("Container de projetos não encontrado.");
        return;
    }

    console.log("Elementos carregados com sucesso!");

    // Função para realizar a busca e exibir os resultados
    async function performSearch(searchTerm) {
        if (!searchTerm) {
            projectsList.innerHTML = "<p>Nenhum termo de pesquisa fornecido.</p>";
            return;
        }

        try {
            const userId = sessionStorage.getItem("userId");
            const token = localStorage.getItem("token");

            if (!userId || !token) {
                alert('Você precisa estar logado para ver os resultados.');
                return;
            }

            const response = await fetch(`http://localhost:3000/api/projetos?search=${searchTerm}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Erro ao realizar a busca");
            }

            const data = await response.json();

            projectsList.innerHTML = ''; // Limpa os resultados anteriores

            if (data.length > 0) {
                data.forEach(projeto => {
                    const tagsHTML = projeto.tags.length > 0
                        ? projeto.tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('')
                        : '';

                    const projectType = projeto.tipoProjeto === 'Processing' ? 'Projeto em Processing' : 'Projeto em p5.js';

                    const thumbnailUrl = projeto.thumbnail ? projeto.thumbnail : 'default-thumbnail.jpg';

                    const projectItem = document.createElement("div");
                    projectItem.classList.add("projeto");

                    projectItem.addEventListener("click", () => {
                        window.location.href = `TelaProjetoIndividual.html?id=${projeto.id}`;
                    });

                    projectItem.innerHTML = `
                        <div class="thumbnail" style="background-image: url('${thumbnailUrl}')"></div>
                        <div class="info-criador">
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
                projectsList.innerHTML = "<p>Nenhum projeto encontrado.</p>";
            }
        } catch (error) {
            console.error("Erro ao realizar a busca:", error);
            projectsList.innerHTML = "<p>Ocorreu um erro ao buscar os projetos. Tente novamente mais tarde.</p>";
        }
    }

    // Captura o termo de pesquisa da URL
    const params = new URLSearchParams(window.location.search);
    const searchTerm = params.get("search");

    if (searchTerm) {
        performSearch(searchTerm);
    } else {
        projectsList.innerHTML = "<p>Nenhum termo de pesquisa fornecido.</p>";
    }
});