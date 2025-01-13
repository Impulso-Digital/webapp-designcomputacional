console.log("Script carregado1");
// Garantir que o DOM esteja completamente carregado antes de executar o código
document.addEventListener('DOMContentLoaded', function () {
    // Seleciona os botões para abrir e fechar os modais
    const openButtons = document.querySelectorAll('.open-modal');
    const closeButtons = document.querySelectorAll('.close-modal');

    // Abrir o modal
    if (openButtons) {
        openButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modalId = button.getAttribute('data-modal');
                const modal = document.getElementById(modalId);
                if (modal) modal.showModal(); // Exibe o modal
            });
        });
    }

    // Fechar o modal
    if (closeButtons) {
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modalId = button.getAttribute('data-modal');
                const modal = document.getElementById(modalId);
                if (modal) modal.close(); // Fecha o modal
            });
        });
    }

    // Alternar entre os modais de cadastro e login
    const switchToLogin = document.querySelector('#modal-2 .text-center a');
    const switchToCadastro = document.querySelector('#modal-1 .text-center a');

    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            const modalCadastro = document.getElementById('modal-2');
            const modalLogin = document.getElementById('modal-1');
            if (modalCadastro && modalLogin) {
                modalCadastro.close();
                modalLogin.showModal();
            }
        });
    }

    if (switchToCadastro) {
        switchToCadastro.addEventListener('click', (e) => {
            e.preventDefault();
            const modalCadastro = document.getElementById('modal-2');
            const modalLogin = document.getElementById('modal-1');
            if (modalCadastro && modalLogin) {
                modalLogin.close();
                modalCadastro.showModal();
            }
        });
    }

    // Função para cadastrar o usuário
    const cadastrarUsuario = async (nome, email, senha) => {
        try {
            const response = await fetch('http://localhost:3000/api/cadastrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome, email, senha }),
            });

            const data = await response.json();
            console.log("Resposta da API:", data);

            if (response.ok) {
                alert("Usuário cadastrado com sucesso!");
            } else {
                alert(`Erro: ${data.error || 'Algo deu errado!'}`);
            }
        } catch (error) {
            console.error("Erro ao cadastrar usuário:", error);
            alert("Erro ao conectar com o servidor!");
        }
    };

    // Seleciona o formulário de cadastro
    const cadastrarForm = document.querySelector('#cadastroForm');
    if (cadastrarForm) {
        cadastrarForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const nome = event.target.nome.value; // Corrigido para o atributo 'name'
            const email = event.target.email.value;
            const senha = event.target.password.value; // Corrigido para o atributo 'name'
            cadastrarUsuario(nome, email, senha);
        });
    }
});

