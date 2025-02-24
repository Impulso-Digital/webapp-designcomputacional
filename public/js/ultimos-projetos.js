document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("http://localhost:3000/api/ultimos-projetos");
        const projetos = await response.json();

        const projetosContainer = document.getElementById("projetos-recentes");

        projetosContainer.innerHTML = ""; // Limpa a área antes de inserir os projetos

        const projetosHTML = projetos
            .map((projeto) => `
                <div class="projeto" data-id="${projeto.id}"> <!-- Adiciona o data-id aqui -->
                    <img src="${projeto.thumbnailUrl || 'assets/img/default-thumbnail.jpg'}" 
                         alt="${projeto.nome}" class="thumbnail">
       
                    <div class="info-criador">
                        <img src="http://localhost:3000${projeto.fotoPerfil || '/assets/img/default-user.jpg'}" 
                             alt="Foto de ${projeto.nomeUsuario}" class="foto-perfil">
                        <h3 class="nome-criador">${projeto.nomeUsuario}</h3>
                    </div>
       
                    <p class="descricao">${projeto.descricao}</p>
       
                    <div class="tags">
                        ${projeto.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            `)
            .join("");

        projetosContainer.innerHTML = projetosHTML;
    } catch (error) {
        console.error("Erro ao carregar os últimos projetos:", error);
    }
});