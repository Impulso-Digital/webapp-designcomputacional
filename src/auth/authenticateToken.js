const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(403).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  try {
    // Verifica e decodifica o token
    const decoded = jwt.verify(token, 'chave'); // A chave secreta usada para gerar o token
    req.user = decoded; // Coloca os dados do usuário no objeto da requisição
    next(); // Chama o próximo middleware ou a função da rota
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido' });
  }
  

};
module.exports = authenticateToken;