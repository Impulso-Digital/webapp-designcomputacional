
//CADASTRO DE USUÁRIO

document.addEventListener("DOMContentLoaded", () => {
    const registroForm = document.querySelector('.form-registro');

    if (registroForm) {
        registroForm.addEventListener('submit', async function (event) {
            event.preventDefault(); // Previne o envio padrão do formulário

            // Coleta os dados do formulário
            const nomeCompleto = document.getElementById('register_name').value.trim();
            const nomeUsuario = document.getElementById('name').value.trim();
            const email = document.getElementById('register_email').value.trim();
            const senha = document.getElementById('register_password').value.trim();
            const confirmSenha = document.getElementById('confirm_password').value.trim();

            // Verificando os valores dos campos
            console.log("nomeCompleto:", nomeCompleto);
            console.log("nomeUsuario:", nomeUsuario);
            console.log("email:", email);
            console.log("senha:", senha);
            console.log("confirmSenha:", confirmSenha);

            // Verifica se todos os campos foram preenchidos
            if (!nomeCompleto || !nomeUsuario || !email || !senha || !confirmSenha) {
                // Identifica qual campo está vazio
                if (!nomeCompleto) console.log("Campo 'Nome Completo' está vazio");
                if (!nomeUsuario) console.log("Campo 'Nome de Usuário' está vazio");
                if (!email) console.log("Campo 'Email' está vazio");
                if (!senha) console.log("Campo 'Senha' está vazio");
                if (!confirmSenha) console.log("Campo 'Confirmação de Senha' está vazio");

                alert("Todos os campos são obrigatórios!");
                return;
            }

            // Verifica se as senhas coincidem
            if (senha !== confirmSenha) {
                alert("As senhas não coincidem. Tente novamente.");
                return;
            }

            // Envia os dados para a API
            try {
                const response = await fetch("http://localhost:3000/api/cadastrar", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nome: nomeCompleto,
                        nome_usuario: nomeUsuario,
                        email: email,
                        senha: senha,
                        confirmPassword: confirmSenha,
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Usuário cadastrado com sucesso!");

                    // Supondo que a API retorne um token ao cadastrar, salve no localStorage
                    if (data.token) {
                        localStorage.setItem("token", data.token);
                    }
                    // armazena o nome do usuário no localStorage
                        localStorage.setItem("username", nomeUsuario);  // 

                    // verifica log armazenado
                        console.log("Nome armazenado no localStorage:", localStorage.getItem("username"));
                    // Redireciona para a tela de usuário
                    window.location.href = "TelaInicialUsuario.html";
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
              'Content-Type': 'application/json',
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
  




// CADASTRO PROJETOS
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const nome = document.getElementById('nome_projeto').value;
            const descricao = document.getElementById('descricao_projeto').value;
            const codigo = document.getElementById('codigo_projeto').value;
            const tags = Array.from(document.querySelectorAll('.tag-button.selected')).map(tag => tag.textContent.trim());

            // Verifique se o token está presente no localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Você precisa estar autenticado para cadastrar um projeto.');
                return window.location.href = '/login'; // Redireciona para a página de login
            }

            try {
                const response = await fetch('http://localhost:3000/api/projetos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Envia o token de autenticação
                    },
                    body: JSON.stringify({ nome, descricao, codigo, tags })
                });

                if (response.ok) {
                    alert('Projeto cadastrado com sucesso!');
                    event.target.reset(); // Reseta o formulário
                    document.querySelectorAll('.tag-button.selected').forEach(tag => tag.classList.remove('selected')); // Limpa as tags selecionadas
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
const tagButtons = document.querySelectorAll('.tag-button');
const maxTags = 5;

function updateTagSelection(tag) {
    if (tag.classList.contains('selected')) {
        tag.classList.remove('selected');
    } else if (document.querySelectorAll('.tag-button.selected').length < maxTags) {
        tag.classList.add('selected');
    } else {
        alert(`Você pode selecionar no máximo ${maxTags} categorias.`);
    }
}

tagButtons.forEach(tag => {
    tag.addEventListener('click', () => updateTagSelection(tag));
});



