const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Récupérer le token du header Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Accès non autorisé. Token manquant.' });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide ou expiré.' });
  }
};

module.exports = auth;