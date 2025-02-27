
//CADASTRO DE USUÁRIO

document.addEventListener("DOMContentLoaded", () => {
    const registroForm = document.querySelector('.form-registro');

    if (registroForm) {
        registroForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const nomeCompleto = document.getElementById('register_name').value.trim();
            const nomeUsuario = document.getElementById('name').value.trim();
            const email = document.getElementById('register_email').value.trim();
            const senha = document.getElementById('register_password').value.trim();
            const confirmSenha = document.getElementById('confirm_password').value.trim();
            const fotoPerfilInput = document.getElementById('fotoPerfilInput').files[0]; // Obtém o arquivo

            if (!nomeCompleto || !nomeUsuario || !email || !senha || !confirmSenha) {
                alert("Todos os campos são obrigatórios!");
                return;
            }

            if (senha !== confirmSenha) {
                alert("As senhas não coincidem. Tente novamente.");
                return;
            }

            // Criando FormData para envio de arquivo + outros dados
            const formData = new FormData();
            formData.append("nome", nomeCompleto);
            formData.append("nome_usuario", nomeUsuario);
            formData.append("email", email);
            formData.append("senha", senha);
            formData.append("confirmPassword", confirmSenha);
            if (fotoPerfilInput) {
                formData.append("fotoPerfil", fotoPerfilInput);
            }

            try {
                const response = await fetch("http://localhost:3000/api/cadastrar", {
                    method: "POST",
                    body: formData, // Agora usando FormData
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Usuário cadastrado com sucesso!");

                    if (data.token) {
                        localStorage.setItem("token", data.token);
                    }

                    localStorage.setItem("username", nomeUsuario);
                    window.location.href = "TelaInicialVisitante.html";
                } else {
                    alert(`Erro: ${data.message}`);
                }
            } catch (error) {
                console.error("Erro ao cadastrar o usuário:", error);
                alert("Erro ao conectar com o servidor.");
            }
        });
    }
});







// LOGIN DE USUÁRIO

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector('.login-main');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault(); // Previne o envio padrão do formulário

            // Coleta os dados de login inseridos
            const email = document.getElementById('login_email').value.trim();
            const senha = document.getElementById('login_password').value.trim();

            // Verificando se ambos os campos foram preenchidos
            if (!email || !senha) {
                alert("Por favor, preencha ambos os campos!");
                return;
            }

            try {
                // Envia uma requisição POST para o servidor com as credenciais
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, senha })
                });

                const data = await response.json();

                if (response.ok) {
                    // Armazenar o token JWT no localStorage
                    localStorage.setItem('token', data.token);
                    sessionStorage.setItem('userId', data.userId); // Armazenando o userId, se necessário

                    // Verifique se o userId foi armazenado corretamente
                    console.log('userId armazenado:', sessionStorage.getItem('userId'));

                    // Redireciona para a tela inicial
                    window.location.href = "TelaInicialUsuario.html";
                } else {
                    // Caso contrário, exibe um erro
                    alert(data.message || "Erro ao tentar fazer login.");
                }
            } catch (error) {
                console.error('Erro no login:', error);
                alert("Erro de comunicação com o servidor. Tente novamente.");
            }
        });
    }
});





/// LOGOUT

document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById('logout');
    
    if (logoutButton) {
      logoutButton.addEventListener('click', async (event) => {
        event.preventDefault();
        
        try {
          const token = localStorage.getItem("token");  // Obtendo o token

          if (!token) {
            alert("Usuário não está autenticado!");
            return;
          }
  
          const response = await fetch('/api/logout', {
            method: 'POST',
            headers: {
            
              'Authorization': `Bearer ${token}`,  // Envia o token para revogação
            },
          });
  
          if (response.ok) {
            // Limpar localStorage e sessionStorage para garantir que as informações sejam removidas
            localStorage.removeItem('token'); // Limpa o token de autenticação
            sessionStorage.removeItem('userId'); // Limpa o ID do usuário
  
            // Redireciona para a página inicial ou login
            window.location.href = '/'; // Ou a página de login
          } else {
            alert('Erro ao realizar o logout.');
          }
        } catch (error) {
          console.error('Erro na requisição de logout:', error);
          alert('Erro na conexão com o servidor.');
        }
      });
    }
  });
  
//Cadastro projeto


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
            const tipoProjeto = document.querySelector('input[name="plataforma"]:checked')?.value;

            if (!tipoProjeto) {
                alert('Selecione uma plataforma (P5.js ou Processing).');
                return; // Impede o envio do formulário
            }

            // Coleta os arquivos
            const thumbnailInput = document.getElementById('thumbnailFile');
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
                const thumbnailFile = thumbnailInput.files[0];
                const maxSize = 5 * 1024 * 1024; // 5MB

                if (thumbnailFile.size > maxSize) {
                    alert('A thumbnail é muito grande. O tamanho máximo permitido é 5MB.');
                    return;
                }

                if (!thumbnailFile.type.startsWith('image/')) {
                    alert('Formato de arquivo inválido. Envie apenas imagens (JPG, PNG, etc.).');
                    return;
                }

                formData.append('thumbnail', thumbnailFile);
            }

            // Verifica se o arquivo de projeto foi selecionado
            if (projetoFileInput && projetoFileInput.files.length > 0) {
                const projetoFile = projetoFileInput.files[0];
                const maxSize = 200 * 1024 * 1024; // 200MB
                const validExtensions = ['.zip', '.tar', '.tar.gz', '.rar', '.7z'];
                const fileExtension = projetoFile.name.split('.').pop().toLowerCase();

                if (projetoFile.size > maxSize) {
                    alert('O arquivo de código é muito grande. O tamanho máximo permitido é 200MB.');
                    return;
                }

                if (!validExtensions.includes('.' + fileExtension)) {
                    alert('Formato de arquivo inválido. Envie arquivos compactados (.zip, .tar, .tar.gz, .rar, .7z).');
                    return;
                }

                formData.append('projetoFile', projetoFile);
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
                    alert('Projeto enviado para aprovação!');
                    // Redireciona para a tela de meus projetos
                    window.location.href = '/TelaInicialUsuario.html';
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

    // Validação do arquivo de thumbnail
    document.getElementById('thumbnailFile').addEventListener('change', function (event) {
        const file = event.target.files[0];
        const errorMessage = document.getElementById('thumbnail-error-message');
        const successMessage = document.getElementById('thumbnail-success-message');
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (file && file.size > maxSize) {
            errorMessage.textContent = "A imagem é muito grande. O tamanho máximo permitido é 5MB.";
            successMessage.style.display = 'none';
        } else if (file && !file.type.startsWith('image/')) {
            errorMessage.textContent = "Formato de arquivo inválido. Envie apenas imagens (JPG, PNG, etc.).";
            successMessage.style.display = 'none';
        } else {
            errorMessage.textContent = '';
            successMessage.style.display = 'block';
        }
    });

    // Validação do arquivo de código
    document.getElementById('projetoFile').addEventListener('change', function (event) {
        const file = event.target.files[0];
        const errorMessage = document.getElementById('projeto-error-message');
        const successMessage = document.getElementById('projeto-success-message');
        const maxSize = 200 * 1024 * 1024; // 200MB
        const validExtensions = ['.zip', '.tar', '.tar.gz', '.rar', '.7z'];
        const fileExtension = file.name.split('.').pop().toLowerCase();

        if (file && file.size > maxSize) {
            errorMessage.textContent = "O arquivo é muito grande. O tamanho máximo permitido é 200MB.";
            successMessage.style.display = 'none';
        } else if (file && !validExtensions.includes('.' + fileExtension)) {
            errorMessage.textContent = "Formato de arquivo inválido. Envie arquivos compactados (.zip, .tar, .tar.gz, .rar, .7z).";
            successMessage.style.display = 'none';
        } else {
            errorMessage.textContent = '';
            successMessage.style.display = 'block';
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




//Botão cancelar
document.querySelector('.cancelar').addEventListener('click', function() {
    window.location.href = 'TelaInicialUsuario.html'; // Redireciona para a tela inicial do usuário
});


