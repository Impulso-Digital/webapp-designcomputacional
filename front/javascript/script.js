const openButtons = document.querySelectorAll('.open-modal');
const closeButtons = document.querySelectorAll('.close-modal');

// Abrir o modal
openButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modalId = button.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        modal.showModal(); // Exibe o modal
    });
});

// Fechar o modal
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modalId = button.getAttribute('data-modal');
        const modal = document.getElementById(modalId);

        modal.close();
    });
});

// Seleciona o link "Logue aqui" no modal de cadastro
document.querySelector('#modal-2 .text-center a').addEventListener('click', function (e) {
    e.preventDefault(); // Impede o comportamento padrão do link

    const modalCadastro = document.getElementById('modal-2');
    const modalLogin = document.getElementById('modal-1');

    modalCadastro.close(); // Fecha o modal de cadastro
    modalLogin.showModal(); // Abre o modal de login
});

// Redirecionar do modal de login para o modal de cadastro
const registerLink = document.querySelector('.text-center a[href="#"]'); // Selecione o link de cadastro
const modalLogin = document.getElementById('modal-1'); // Modal de login
const modalRegister = document.getElementById('modal-2'); // Modal de cadastro

registerLink.addEventListener('click', (e) => {
    e.preventDefault(); // Evita que o link faça o comportamento padrão
    modalLogin.close(); // Fecha o modal de login
    modalRegister.showModal(); // Abre o modal de cadastro
});


