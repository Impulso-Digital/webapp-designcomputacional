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
            const nome = event.target.nome.value; 
            const email = event.target.email.value;
            const senha = event.target.password.value; 
            cadastrarUsuario(nome, email, senha);
        });
    }
});



//Projetos
// Função para abrir o modal
function openModal() {
    const modal = document.getElementById('modal-projeto');
    modal.showModal();
}

// Função para fechar o modal
function closeModal() {
    const modal = document.getElementById('modal-projeto');
    modal.close();
}

document.getElementById("projetoForm").addEventListener("submit", async function (event) {
    event.preventDefault();  // Previne o envio padrão do formulário

    const nome = document.getElementById("projeto_nome").value;
    const descricao = document.getElementById("projeto_descricao").value;
    const codigo = document.getElementById("projeto_codigo").value;
    const userId = 1;  // Aqui você pode configurar o ID do usuário conforme necessário

    try {
        // Enviar a requisição para o back-end
        const response = await fetch("http://localhost:3000/api/projetos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nome,
                descricao: descricao,
                codigo: codigo,
                userId: userId,
            }),
        });

        // Verificar se a requisição foi bem-sucedida
        if (!response.ok) {
            throw new Error("Erro ao cadastrar o projeto.");
        }

        // Limpar o formulário após o envio
        document.getElementById("projetoForm").reset();

        // Fechar o modal após o cadastro
        document.getElementById("modal-projeto").close();

        // Exibir mensagem de sucesso
        alert("Projeto cadastrado com sucesso!");

        // Atualizar a lista de projetos na interface (se necessário)
        // Pode chamar uma função que recarregue a lista de projetos aqui

    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao cadastrar o projeto. Tente novamente.");
    }
});