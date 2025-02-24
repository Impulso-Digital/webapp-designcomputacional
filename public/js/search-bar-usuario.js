document.addEventListener("DOMContentLoaded", () => {
    console.log("Script carregado. Verificando elementos...");

    const searchButton = document.getElementById("search-button");
    const searchInput = document.getElementById("search-input");

    console.log("Elementos encontrados:", {
        searchButton,
        searchInput
    });

    if (!searchButton || !searchInput) {
        console.error("Elemento de busca não encontrado.");
        return;
    }

    console.log("Elementos carregados com sucesso!");

    // Função para redirecionar para a página de resultados
    function redirectToSearchResults(searchTerm) {
        if (!searchTerm) {
            alert("Por favor, digite um termo de pesquisa.");
            return;
        }

        // Redireciona para a página de resultados com o termo de pesquisa na URL
        window.location.href = `TelaResultadosPesquisa.html?search=${encodeURIComponent(searchTerm)}`;
    }

    // Adiciona o evento de clique e enter ao botão de busca
    searchButton.addEventListener("click", (event) => {
        event.preventDefault();
        const searchTerm = searchInput.value.trim();
        redirectToSearchResults(searchTerm);
    });

    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            const searchTerm = searchInput.value.trim();
            redirectToSearchResults(searchTerm);
        }
    });
});