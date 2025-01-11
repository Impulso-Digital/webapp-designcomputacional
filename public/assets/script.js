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

// Seleciona o link "Logue aqui" no modal de cadastro
const cadastroLink = document.querySelector('#modal-2 .text-center a');
if (cadastroLink) {
    cadastroLink.addEventListener('click', (e) => {
        e.preventDefault(); // Impede o comportamento padrão do link

        const modalCadastro = document.getElementById('modal-2');
        const modalLogin = document.getElementById('modal-1');

        if (modalCadastro && modalLogin) {
            modalCadastro.close(); // Fecha o modal de cadastro
            modalLogin.showModal(); // Abre o modal de login
        }
    });
}

// Seleciona o link "Cadastre-se aqui" no modal de login
const loginLink = document.querySelector('.text-center a[href="#"]');
if (loginLink) {
    loginLink.addEventListener('click', (e) => {
        e.preventDefault(); // Evita que o link faça o comportamento padrão

        const modalLogin = document.getElementById('modal-1'); // Modal de login
        const modalRegister = document.getElementById('modal-2'); // Modal de cadastro

        if (modalLogin && modalRegister) {
            modalLogin.close(); // Fecha o modal de login
            modalRegister.showModal(); // Abre o modal de cadastro
        }
    });
}

