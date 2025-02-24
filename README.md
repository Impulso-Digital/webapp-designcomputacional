![CAPA](public/logos/idbanner.png)

Aplicação Web em desenvolvimento para a disciplina de Projeto Integrado I, do curso de Sistemas e Mídias Digitais da Universidade Federal do Ceará.

- [📝 Sobre o Projeto](#-sobre-o-projeto)
- [🎯 Funcionalidades](#-funcionalidades)
- [⚙️ Requisitos Funcionais](#requisitos-funcionais)
- [⚙️ Requisitos Não Funcionais](#requisitos-não-funcionais)
- [🛠️ Tecnologias e Ferramentas Utilizadas](#️-tecnologias-e-ferramentas-utilizadas)
- [👥 Integrantes do Grupo](#-integrantes-do-grupo)

## 📝 Sobre o Projeto

Apresentar e compilar de forma organizada e acessível os projetos produzidos pelos alunos de Design Computacional, visando torná-los compreensíveis e atrativos para monitores, alunos atuais, potenciais futuros alunos e demais interessados na disciplina.

## **Instalação**

### 1. **Clone o repositório:**

```bash
git clone https://github.com/Impulso-Digital/webapp-designcomputacional.git

```

### 2. **Instale as dependências:**

É necessário ter o Node.js e npm instalados.

Navegue até a pasta do projeto:

    cd caminhodorepositorio

    npm install

### 3. **Configure o Banco de Dados**

1. Vá para a raiz do projeto.
2. Crie um arquivo com o nome `.env`
3. Configure a variável `DATABASE_URL` no arquivo `.env` com a conexão do banco de dados PostgreSQL.

   Exemplo:
   `DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco(mydb?schema=public*exemplo)"`

4. Configure a variável `JWT_SECRET` que servirá para autenticação de usuário.
   Exemplo:
   `JWT_SECRET="minha_chave_secreta"`   

### 4. **Sincronize o Prisma com o Banco de Dados**

Rode o comando ` npx prisma migrate dev`

### 5. **Inicie o servidor**

`npm start`

E o servidor estará rodando em `http://localhost:3000`.

### 6. **Comandos para Desenvolvedor**

No código existem alguns comandos para teste. Se você desejar resetar todos os projetos criados, todos os usuários e todos os ID's, rode o comando:
`npm run resetAll`.
(AVISO: Esse comando irá reiniciar completamente o banco de dados)


## 🎯 Funcionalidades

### Requisitos Funcionais

| Status              | Descrição                                              |
| ------------------- | ------------------------------------------------------ |
| **✅ Feito**        | A funcionalidade foi implementada e concluída.         |
| **🚧 Em andamento** | A funcionalidade está em desenvolvimento.              |
| **⏳ Pendente**     | A funcionalidade ainda não começou ou está aguardando. |
| **🛠️ Em revisão**   | A funcionalidade está sendo testada ou revisada.       |

|   Código   | Requisito                                                                                         | Status |
| :--------: | ------------------------------------------------------------------------------------------------- | :----: |
| **RF 001** | Permitir o cadastro de usuários com informações básicas (nome, email e senha).                    |   ✅   |
| **RF 002** | Implementar sistema de autenticação.                                                              |   ✅   |
| **RF 003** | Permitir a definição de papéis para os usuários (ex.: administrador, usuário, visitante).         |   ✅   |
| **RF 004** | Disponibilizar uma página inicial com informações gerais e links para funcionalidades principais. |   ✅   |
| **RF 005** | Permitir que usuários adicionem, editem ou excluam conteúdos conforme suas permissões.            |   ✅   |
| **RF 006** | Exibir uma lista de conteúdos cadastrados.                                                        |   ✅   |
| **RF 007** | Permitir busca por conteúdo, com base em palavras-chave ou outras características básicas.        |   ✅  |
| **RF 008** | Organizar os conteúdos por categorias.                                                            |   ✅  |
| **RF 009** | Permitir a visualização detalhada de cada conteúdo.                                               |   ✅   |
| **RF 010** | Oferecer orientação básica para o uso da plataforma.                                              |   ✅   |



## 🛠️ Tecnologias e Ferramentas Utilizadas

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Express](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-000?style=for-the-badge&logo=postgresql)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

## 👥 Integrantes do Grupo

| Integrantes                                                                                                                             | Cargo                       |
| --------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| <img src="public/logos/favicon.png" alt="ICONE" width="16" style="vertical-align: middle;"> **Rubens Leandro dos Santos**               | **Desenvolvedor Back-End**  |
| <img src="public/logos/favicon.png" alt="ICONE" width="16" style="vertical-align: middle;"> **Guilherme Matos Viana**                   | **Desenvolvedor Back-End**  |
| <img src="public/logos/favicon.png" alt="ICONE" width="16" style="vertical-align: middle;"> **Samuel de Sousa Leles**                   | **Designer UI**             |
| <img src="public/logos/favicon.png" alt="ICONE" width="16" style="vertical-align: middle;"> **Levi de Sousa Alves**                     | **Desenvolvedor Front-End** |
| <img src="public/logos/favicon.png" alt="ICONE" width="16" style="vertical-align: middle;"> **Enzo Ranieri Barbosa Rodrigues da Silva** | **Designer UI**             |
| <img src="public/logos/favicon.png" alt="ICONE" width="16" style="vertical-align: middle;"> **Carlos Renan Carrilho Lopes Junior**      | **Desenvolvedor front-end** |
| <img src="public/logos/favicon.png" alt="ICONE" width="16" style="vertical-align: middle;"> **Gabriel Silva Alves dos Santos**          | **Designer UX**             |

---
