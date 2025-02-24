document.addEventListener('DOMContentLoaded', function () {
    const openModalButtons = document.querySelectorAll('.open-modal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const modals = document.querySelectorAll('dialog');

    // Abrir o modal
    openModalButtons.forEach(button => {
        button.addEventListener('click', function () {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);

            // Mostrar o modal
            modal.style.visibility = 'visible';  // Garantir que a visibilidade está correta
            modal.style.zIndex = '1000';  // Colocar o modal acima de outros elementos
            modal.showModal();  // Método para abrir o modal
        });
    });

    // Fechar o modal
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function () {
            const modal = this.closest('dialog');
            modal.close();  // Fechar o modal com o método close
            // Após fechar, garantir que o modal não seja visível fora do método close()
            modal.style.visibility = 'hidden';
            modal.style.zIndex = '-1';
        });
    });

    // Fechar o modal ao clicar fora dele
    modals.forEach(modal => {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.close();  // Fechar o modal se clicar fora dele
                // Ocultar o modal quando fechado
                modal.style.visibility = 'hidden';
                modal.style.zIndex = '-1';
            }
        });
    });

    // Botão "AINDA NÃO POSSUI UMA CONTA?" no modal de login
    const modalRegistroButton = document.getElementById('modal_registro_button');
    if (modalRegistroButton) {
        modalRegistroButton.addEventListener('click', function () {
            // Fechar o modal de login
            const modalLogin = document.getElementById('modal-2');
            modalLogin.close();
            modalLogin.style.visibility = 'hidden';
            modalLogin.style.zIndex = '-1';

            // Abrir o modal de registro
            const modalRegistro = document.getElementById('modal-1');
            modalRegistro.style.visibility = 'visible';
            modalRegistro.style.zIndex = '1000';
            modalRegistro.showModal();
        });
    }
});