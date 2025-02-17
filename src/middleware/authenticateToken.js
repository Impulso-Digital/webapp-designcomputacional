const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(403).json({ message: "Token não fornecido" });
    }

    // Verifica se o token está na blacklist
    const tokenRevogado = await prisma.tokenBlacklist.findUnique({
        where: { token },
    });

    if (tokenRevogado) {
        return res.status(403).json({ message: "Token inválido ou revogado" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token inválido" });
        }

        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
