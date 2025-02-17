const fs = require('fs');
const path = require('path');

// Caminho da pasta de uploads
const uploadsDir = path.join(__dirname, './uploads');

// Função para deletar arquivos na pasta de uploads
const deleteUploadedFiles = () => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      console.error("Erro ao ler a pasta de uploads:", err);
      return;
    }

    // Iterar sobre os arquivos na pasta e deletar cada um
    files.forEach(file => {
      const filePath = path.join(uploadsDir, file);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Erro ao deletar o arquivo ${file}:`, err);
        } else {
          console.log(`Arquivo ${file} deletado com sucesso.`);
        }
      });
    });
  });
};

// Executar a função para deletar os arquivos
deleteUploadedFiles();
