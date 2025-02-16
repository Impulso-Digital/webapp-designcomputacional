document.addEventListener("DOMContentLoaded", async () => {
    const userId = sessionStorage.getItem("userId");  // Obtém o userId armazenado no sessionStorage
    const token = localStorage.getItem("token");  // Obtém o token JWT para autenticação

    if (!userId || !token) {
        alert('Você precisa estar logado para ver seus projetos.');
        return;
    }

    // Alterando o título para incluir o nome do usuário logado
    const username = localStorage.getItem("username"); // Usando o nome do usuário para título
    document.getElementById("title").textContent = `PROJETOS DE ${username}`;

    try {
        const response = await fetch(`http://localhost:3000/api/projetos/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`  // Envia o token para autenticação
            }
        });

        if (!response.ok) {
            throw new Error("Erro ao carregar projetos");
        }

        const data = await response.json();

        if (data.projetos && data.projetos.length > 0) {
            const projectsList = document.getElementById("projetos-container");

            // Limpa qualquer conteúdo anterior
            projectsList.innerHTML = '';

            data.projetos.forEach(projeto => {
                const tagsHTML = Array.isArray(projeto.tags) 
                    ? projeto.tags.map(tag => `<span class="tag">${tag}</span>`).join('') 
                    : '';

                const projectItem = document.createElement("div");
                projectItem.classList.add("projeto");

                projectItem.innerHTML = `
                    <div class="thumbnail" style="background-image: url('${projeto.thumbnailUrl}')"></div>
                    <div class="info-criador">
                        <div class="foto-perfil"></div>
                        <h3 class="nome-criador">${projeto.nome}</h3>
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
