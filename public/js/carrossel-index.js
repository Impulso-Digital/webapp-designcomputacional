let indice = 0;
let projetos = [];
const imagens = document.querySelector(".imagens");

// IDs dos projetos específicos que você quer no carrossel
const projetosId = [1, 2, 3, 4];

// Função para mudar as imagens no carrossel
function mudarImagem(direcao) {
    const totalImagens = projetos.length;

    indice += direcao;

    // Verifica se o índice está fora dos limites
    if (indice < 0) {
        indice = totalImagens - 1;
    } else if (indice >= totalImagens) {
        indice = 0;
    }

    // Atualiza a posição do carrossel
    imagens.style.transform = `translateX(-${indice * 100}%)`; // 100% por projeto (1 projeto por vez)
}

document.addEventListener("DOMContentLoaded", async () => {
    const carrosselContainer = document.querySelector(".carrossel .imagens");

    // Função para buscar os projetos da API
    async function fetchProjetosCarrossel() {
        try {
            const response = await fetch("http://localhost:3000/api/projetos");
            if (!response.ok) throw new Error("Erro ao carregar projetos");

            const data = await response.json();
            projetos = data.projetos.filter(projeto => projetosId.includes(projeto.id));

            if (projetos.length === 0) {
                carrosselContainer.innerHTML = "<p>Não há projetos disponíveis para o carrossel.</p>";
                return;
            }

            // Limpando o conteúdo do carrossel
            carrosselContainer.innerHTML = "";

            // Adicionando as imagens (thumbnails) no carrossel
            projetos.forEach(projeto => {
                const thumbnailUrl = projeto.thumbnail || 'default-thumbnail.jpg';
                const projectItem = document.createElement("div");
                projectItem.classList.add("imagem");

                // Adicionando a thumbnail e o evento de clique para redirecionar
                projectItem.innerHTML = `
                    <div class="thumbnail" style="background-image: url('${thumbnailUrl}')"></div>
                `;

                // Evento de clique para redirecionar para a tela do projeto individual
                projectItem.addEventListener("click", () => {
                    window.location.href = `TelaProjetoIndividual.html?id=${projeto.id}`;
                });

                carrosselContainer.appendChild(projectItem);
            });

            // Atualiza a thumbnail correta ao iniciar o carrossel
            atualizarThumbnail();

            // Iniciar o carrossel com a primeira imagem
            mudarImagem(0);

        } catch (error) {
            console.error("Erro ao carregar projetos para o carrossel:", error);
            carrosselContainer.innerHTML = "<p>Erro ao carregar projetos para o carrossel.</p>";
        }
    }

    fetchProjetosCarrossel();
});

// Atualiza a thumbnail visível conforme o projeto atual
function atualizarThumbnail() {
    const projetoAtual = projetos[indice];
    const thumbnails = document.querySelectorAll('.imagem .thumbnail');

    thumbnails.forEach((thumbnail, i) => {
        // Altera o estilo de background das thumbnails
        const projeto = projetos[(indice + i) % projetos.length];
        thumbnail.style.backgroundImage = `url('${projeto.thumbnail}')`;
    });
}
