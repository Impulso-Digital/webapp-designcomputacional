//Cadastro de projeto
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();  // Impede o envio padrão do formulário

            // Coleta os dados do formulário
            const nome = document.getElementById('nome_projeto').value;
            const descricao = document.getElementById('descricao_projeto').value;
            const codigo = document.getElementById('codigo_projeto').value;
            const tags = Array.from(document.querySelectorAll('.tag.selected')).map(tag => tag.textContent.trim());
            const tipoProjeto = document.getElementById('tipo_projeto').value;

            // Coleta os arquivos
            const thumbnailInput = document.getElementById('thumbnail');
            const projetoFileInput = document.getElementById('projetoFile');

            // Verifica se o token está presente no localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Você precisa estar autenticado para cadastrar um projeto.');
                return window.location.href = '/login'; // Redireciona para a página de login
            }

            // Criação do FormData para envio dos dados do projeto (com arquivos)
            const formData = new FormData();
            formData.append('nome', nome);
            formData.append('descricao', descricao);
            formData.append('codigo', codigo);
            formData.append('tags', tags.join(',')); // Envia as tags separadas por vírgula
            formData.append('tipoProjeto', tipoProjeto);

            // Verifica se o arquivo de thumbnail foi selecionado
            if (thumbnailInput && thumbnailInput.files.length > 0) {
                formData.append('thumbnail', thumbnailInput.files[0]);
            }

            // Verifica se o arquivo de projeto foi selecionado
            if (projetoFileInput && projetoFileInput.files.length > 0) {
                formData.append('projetoFile', projetoFileInput.files[0]);
            }

            // Envia os dados para o servidor
            try {
                const response = await fetch('http://localhost:3000/api/projetos', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                if (response.ok) {
                    alert('Projeto cadastrado com sucesso!');
                    // Redireciona para a tela de meus projetos
                    window.location.href = '/TelaMeusProjetos.html';
                } else {
                    const errorData = await response.json();
                    alert(`Erro ao cadastrar o projeto: ${errorData.message || 'Tente novamente mais tarde.'}`);
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro na conexão com o servidor.');
            }
        });
    }
});



// Lógica para selecionar e limitar tags
document.addEventListener("DOMContentLoaded", () => {
    const tags = document.querySelectorAll(".tag");
    const maxTags = 5;

    tags.forEach(tag => {
        tag.addEventListener("click", function () {
            const selectedTags = document.querySelectorAll(".tag.selected");

            // Verifica se a tag já está selecionada
            if (this.classList.contains("selected")) {
                this.classList.remove("selected"); // Deseleciona a tag se já estiver selecionada
            } else if (selectedTags.length < maxTags) {
                this.classList.add("selected"); // Seleciona a tag se ainda não atingiu o limite
            } else {
                // Se o número máximo de tags selecionadas for atingido
                alert(`Você pode selecionar no máximo ${maxTags} categorias.`);
            }

            // Atualiza as tags selecionadas no console (opcional para depuração)
            const updatedSelectedTags = Array.from(document.querySelectorAll('.tag.selected')).map(tag => tag.textContent.trim());
            console.log('Tags selecionadas:', updatedSelectedTags);
        });
    });
});
