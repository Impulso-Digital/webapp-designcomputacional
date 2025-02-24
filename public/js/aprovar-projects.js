document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "TelaInicialVisitante.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/projetos/pendentes", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const projetos = await response.json();
        const container = document.getElementById("projetos-container");
        container.innerHTML = ""; // Limpa o carregamento inicial

        if (projetos.length === 0) {
            container.innerHTML = "<p>Não há projetos pendentes.</p>";
            return;
        }

        projetos.forEach(projeto => {
            const projetoDiv = document.createElement("div");
            projetoDiv.classList.add("projeto");
            projetoDiv.innerHTML = `
                <h3>${projeto.nome} (de ${projeto.user.nome})</h3>
                <p>${projeto.descricao}</p>
                <button class="aprovar-btn" onclick="aprovarProjeto(${projeto.id})">Aprovar</button>
            `;
            container.appendChild(projetoDiv);
        });
    } catch (error) {
        console.error("Erro ao carregar projetos pendentes:", error);
    }
});

async function aprovarProjeto(id) {
    const token = localStorage.getItem("token");

    try {
        await fetch(`http://localhost:3000/api/projetos/aprovar/${id}`, {
            method: "PUT",
            headers: { "Authorization": `Bearer ${token}` }
        });

        alert("Projeto aprovado!");
        location.reload();
    } catch (error) {
        console.error("Erro ao aprovar projeto:", error);
    }
}

// Botão de logout
document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "TelaInicialVisitante.html";
});
