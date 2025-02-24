const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');  // Para gerar dados falsos
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Caminho relativo para a pasta de thumbnails
const thumbnailFolderPath = path.join(__dirname, 'public', 'images', 'mockup');

// Caminho fixo para o arquivo zip
const projetoFilePath = './images/mockup/fakerfile.zip'; // Caminho para o arquivo zip dentro de mockup

// Função para escolher aleatoriamente uma imagem da pasta de thumbnails
const getRandomThumbnail = () => {
  const thumbnails = fs.readdirSync(thumbnailFolderPath).filter(file => 
    file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png') || file.endsWith('.gif') // Filtra apenas imagens e gifs
  );

  // Escolhe aleatoriamente uma thumbnail
  const randomThumbnail = thumbnails[Math.floor(Math.random() * thumbnails.length)];

  // Salva o caminho relativo à pasta 'public', mas sem o 'public'
  return path.join('images', 'mockup', randomThumbnail); // Caminho relativo
};

async function generateFakeProjects() {
  // Definindo a quantidade de projetos que você quer gerar
  const numProjects = 50;

  for (let i = 0; i < numProjects; i++) {
    try {
      // Escolhendo aleatoriamente uma thumbnail
      const thumbnailPath = getRandomThumbnail();

      // Criando o projeto no banco de dados
      const project = await prisma.projeto.create({
        data: {
          nome: faker.commerce.productName(),
          descricao: faker.lorem.sentence(),
          tags: faker.lorem.words(5),  // Gerando 5 tags
          codigo: faker.lorem.paragraph(),  // Aqui você pode adicionar código real ou fake
          tipoProjeto: faker.helpers.arrayElement(['p5.js', 'Processing']),
          userId: 1, // Assumindo que o usuário com ID 1 já existe, ou crie usuários automaticamente também
          status: 'aprovado', // Você pode definir como quiser
          thumbnail: thumbnailPath,  // Usando o caminho da imagem aleatória
          projetoFile: projetoFilePath,  // Usando o caminho do arquivo zip fixo
        },
      });

      console.log(`Projeto criado: ${project.nome}`);
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
    }
  }
}

generateFakeProjects().catch(e => {
  console.error(e);
  process.exit(1);
});
