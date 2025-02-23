document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("http://localhost:3000/api/ultimos-projetos");
        const projetos = await response.json();

        const projetosContainer = document.getElementById("projetos-recentes");

        projetosContainer.innerHTML = ""; // Limpa a área antes de inserir os projetos

        const projetosHTML = projetos
            .map(
                (projeto) => `
                <div class="projeto-card">
                    <img src="${projeto.thumbnailUrl || 'assets/img/default-thumbnail.jpg'}" 
                         alt="${projeto.nome}" class="thumbnail">
                    <h3>${projeto.nome}</h3>
                    <p>${projeto.descricao}</p>
                    <a href="verProjeto.html?id=${projeto.id}" class="ver-detalhes">Ver mais</a>
                </div>
            `
            )
            .join(""); // Converte o array para uma única string otimizada

        projetosContainer.innerHTML = projetosHTML;
    } catch (error) {
        console.error("Erro ao carregar os últimos projetos:", error);
    }
});
