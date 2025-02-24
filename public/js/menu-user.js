// Função para mostrar ou esconder o dropdown
document.querySelector('.dropbtn').addEventListener('click', function() {
    document.querySelector('.dropdown-content').classList.toggle('show');
});

// Fechar o dropdown se o usuário clicar fora dele
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    // Verifique se há um token no localStorage
    if (token) {
        try {
            // Decodificando o payload do token JWT
            const payload = JSON.parse(atob(token.split('.')[1]));  // O payload deve ser um objeto JSON

            console.log("Payload do token:", payload);  // Depuração: Verifique o payload

            // Encontrando o menu dropdown
            const dropdownContent = document.querySelector('.dropdown-content');

            // Verificando se a role do usuário é 'admin'
            if (payload.role === 'admin') {
                // Verifica se o link já existe
                if (!dropdownContent.querySelector('#approveLink')) {
                    const approveLink = document.createElement('a');
                    approveLink.id = 'approveLink'; // Adiciona um ID para facilitar a verificação
                    approveLink.href = './TelaAprovaAdm.html'; // Link para a tela de aprovação
                    approveLink.textContent = 'Aprovar Projetos';

                    // Adicionando o link ao dropdown
                    dropdownContent.insertBefore(approveLink, dropdownContent.querySelector('#logout'));

                    console.log("Link de aprovação adicionado para admin.");  // Depuração
                }
            } else {
                // Se o usuário não for admin, remove o link de aprovação (se existir)
                const approveLink = dropdownContent.querySelector('#approveLink');
                if (approveLink) {
                    approveLink.remove(); // Remove o link do DOM
                    console.log("Link de aprovação removido para não-admin.");  // Depuração
                }
            }
        } catch (error) {
            console.error("Erro ao decodificar o token:", error);
        }
    } else {
        // Caso não tenha token (usuário não logado), remove o link de aprovação (se existir)
        const dropdownContent = document.querySelector('.dropdown-content');
        const approveLink = dropdownContent.querySelector('#approveLink');
        if (approveLink) {
            approveLink.remove(); // Remove o link do DOM
            console.log("Usuário não logado. Link de aprovação removido.");  // Depuração
        }
    }
});