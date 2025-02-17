const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Diretório de uploads
const uploadDir = path.resolve(__dirname, '../../uploads');

// Verificar se o diretório de upload existe, se não, cria
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Criar subdiretórios para thumbnails e arquivos de projeto
const thumbnailsDir = path.resolve(uploadDir, 'thumbnails');
const projetosDir = path.resolve(uploadDir, 'projetos');

if (!fs.existsSync(thumbnailsDir)) {
    fs.mkdirSync(thumbnailsDir, { recursive: true });
}

if (!fs.existsSync(projetosDir)) {
    fs.mkdirSync(projetosDir, { recursive: true });
}

// Configuração do multer para o upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.fieldname === 'thumbnail' ? thumbnailsDir : projetosDir;
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    // Usando o campo de file.fieldname e o timestamp para garantir nomes únicos
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extension}`);
  }
});

// Inicializar o middleware de upload
const upload = multer({ storage: storage }).fields([
  { name: 'thumbnail', maxCount: 1 },  // Permite apenas 1 thumbnail
  { name: 'projetoFile', maxCount: 1 }  // Permite apenas 1 arquivo de projeto
]);

module.exports = { upload };
