// Ajouter cette ligne pour le port Render
const PORT = process.env.PORT || 5000;
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Import des routes
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/clients');
const productRoutes = require('./routes/products');
const invoiceRoutes = require('./routes/invoices');

// Routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'API NK Consulting est en ligne ✅' });
});

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/products', productRoutes);
app.use('/api/invoices', invoiceRoutes);

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
});