const fs = require('fs');
const path = require('path');

const deleteFolderContents = (folderPath) => {
    fs.rm(folderPath, { recursive: true, force: true }, (err) => {
        if (err) {
            console.error(`Erro ao deletar ${folderPath}:`, err);
        } else {
            console.log(`Arquivos em ${folderPath} deletados com sucesso.`);
        }
    });
};

// Caminhos das pastas a serem deletadas
const projetosDir = path.join(__dirname, 'uploads/projetos');
const thumbnailsDir = path.join(__dirname, 'uploads/thumbnails');
const fotoPerfilDir = path.join (__dirname, 'uploads/fotosPerfil');
// Deletar conteúdos das pastas
deleteFolderContents(projetosDir);
deleteFolderContents(thumbnailsDir);
deleteFolderContents(fotoPerfilDir);