document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("http://localhost:3000/api/ultimos-projetos");
        if (!response.ok) throw new Error("Erro ao carregar os últimos projetos");

        const projetos = await response.json();
        const container = document.getElementById("projetos-container");
        container.innerHTML = ''; // Limpa o conteúdo antes de inserir novos projetos

        if (projetos.length === 0) {
            container.innerHTML = "<p>Não há projetos cadastrados recentemente.</p>";
            return;
        }

        projetos.forEach(projeto => {
            console.log(projeto);  // Verifique se os dados estão corretos, especialmente `thumbnail` e `nome`
            
            // Processa as tags (caso existam)
            const tagsHTML = projeto.tags
                ? projeto.tags.split(",").map(tag => `<span class="tag">${tag.trim()}</span>`).join("")
                : '';

            // Usando o caminho completo para a thumbnail
            const thumbnailUrl = projeto.thumbnail ? `http://localhost:3000${projeto.thumbnail}` : "default-thumbnail.jpg";  // Fallback para uma imagem padrão

            // Verifica o nome do criador
            const nomeCriador = projeto.nomeUsuario || projeto.nome;  // Verifica se o nome do usuário ou projeto existe

            const projectItem = document.createElement("div");
            projectItem.classList.add("projeto");

            projectItem.innerHTML = `
                <div class="thumbnail" style="background-image: url('${thumbnailUrl}')"></div>
                <div class="info-criador">
                    <div class="foto-perfil"></div>
                    <h3 class="nome-criador">${nomeCriador}</h3>
                </div>
                <p class="descricao">${projeto.descricao}</p>
                <div class="tags">
                    ${tagsHTML}
                </div>
            `;

            container.appendChild(projectItem);
        });

    } catch (error) {
        console.error("Erro ao carregar projetos:", error);
        alert("Erro ao carregar os últimos projetos.");
    }
});
