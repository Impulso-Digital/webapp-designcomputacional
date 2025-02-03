
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
                    // Quando o cadastro for bem-sucedido, armazene o nome do usuário no localStorage
                        localStorage.setItem("username", nomeCompleto);  // ou nomeUsuario, se preferir usar o nome de usuário

                    // Verifique no console se o nome foi armazenado corretamente
                        console.log("Nome armazenado no localStorage:", localStorage.getItem("username"));
                    // Redireciona para a tela de usuário
                    window.location.href = "telausuario.html";
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




//LOGIN DE USUÁRIO

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector('.login-main');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault(); // Previne o envio padrão do formulário

            // Coleta os dados de login inseridos
            const email = document.getElementById('login_email').value.trim();
            const senha = document.getElementById('login_password').value.trim();

            // Imprimir os valores de email e senha para depuração
            console.log("Email:", email);  // Verificar se o valor está sendo capturado
            console.log("Senha:", senha);  // Verificar se o valor está sendo capturado

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
                    // Se o login for bem-sucedido, pode armazenar o token ou redirecionar
                    alert("Login bem-sucedido!");
                    window.location.href = "telausuario.html"; // Alterar conforme a necessidade
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







// Cadastrar Projeto
document.addEventListener('DOMContentLoaded', () => {
    // Tags predefinidas (exemplo)
    const tags = ["Arte", "Ciência", "Tecnologia", "Educação", "Interatividade"];
  
    // Preencher as tags no formulário
    const tagsContainer = document.getElementById('tagsContainer');
    tags.forEach(tag => {
      const label = document.createElement('label');
      label.innerHTML = `<input type="checkbox" name="tags" value="${tag}"> ${tag}`;
      tagsContainer.appendChild(label);
    });
  
    // Função para rodar o código p5.js e exibir a pré-visualização
    const previewCanvas = document.getElementById('p5preview');
    const codigoInput = document.getElementById('codigo');
  
    codigoInput.addEventListener('input', () => {
      previewCanvas.innerHTML = ''; // Limpar a pré-visualização
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.textContent = `
        function setup() {
          createCanvas(400, 400);
          ${codigoInput.value}
        }
        function draw() {
          ${codigoInput.value}
        }
      `;
      previewCanvas.appendChild(script);
    });
  
    // Envio do formulário
    const projetoForm = document.getElementById('projetoForm');
    projetoForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const descricao = document.getElementById('descricao').value;
      const tags = Array.from(document.querySelectorAll('input[name="tags"]:checked')).map(tag => tag.value);
      const codigo = document.getElementById('codigo').value;
      const thumbnail = document.getElementById('thumbnail').files[0];
  
      const formData = new FormData();
      formData.append('descricao', descricao);
      formData.append('tags', tags.join(','));
      formData.append('codigo', codigo);
      if (thumbnail) {
        formData.append('thumbnail', thumbnail);
      }
  
      // Enviar para o servidor
      try {
        const response = await fetch('/api/projetos', {
          method: 'POST',
          body: formData,
        });
  
        if (response.ok) {
          alert('Projeto cadastrado com sucesso!');
        } else {
          alert('Erro ao cadastrar projeto.');
        }
      } catch (error) {
        console.error('Erro no envio do projeto:', error);
        alert('Erro no servidor.');
      }
    });
  
    // Cancelar
    const cancelarBtn = document.getElementById('cancelarBtn');
    cancelarBtn.addEventListener('click', () => {
      window.location.href = '/'; // Redirecionar para a página inicial ou outra página desejada
    });
  });
  