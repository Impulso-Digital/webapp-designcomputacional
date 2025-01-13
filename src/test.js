const axios = require('axios');
const readlineSync = require('readline-sync');

// Função para cadastrar o usuário
async function cadastrarUsuario() {
    console.log("Cadastro de Usuário:");
    const nome = readlineSync.question('Digite o nome: ');
    const email = readlineSync.questionEMail('Digite o e-mail: ');
    const senha = readlineSync.question('Digite a senha: ', {
        hideEchoBack: true // Oculta a senha enquanto digita
    });

    try {
        const response = await axios.post('http://localhost:3000/api/cadastrar', {
            nome,
            email,
            senha
        });
        console.log('Cadastro realizado com sucesso:', response.data);
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error.response ? error.response.data : error.message);
    }
}

// Função para realizar o login
async function realizarLogin() {
    console.log("\nLogin de Usuário:");
    const email = readlineSync.questionEMail('Digite o e-mail: ');
    const senha = readlineSync.question('Digite a senha: ', {
        hideEchoBack: true // Oculta a senha enquanto digita
    });

    try {
        const response = await axios.post('http://localhost:3000/api/login', {
            email,
            senha
        });
        console.log('Login realizado com sucesso, token:', response.data.token);
    } catch (error) {
        console.error('Erro ao fazer login:', error.response ? error.response.data : error.message);
    }
}

// Menu de opções
async function menu() {
    console.log("\nEscolha uma opção:");
    console.log("1 - Cadastro");
    console.log("2 - Login");
    const escolha = readlineSync.questionInt('Digite o número da opção: ');

    if (escolha === 1) {
        await cadastrarUsuario();
    } else if (escolha === 2) {
        await realizarLogin();
    } else {
        console.log("Opção inválida!");
    }
}

// Executa o menu
menu();
