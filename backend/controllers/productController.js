const pool = require('../config/db');

// Créer un produit
const createProduct = async (req, res) => {
  try {
    const { name, description, price_ht, tva_rate, currency } = req.body;
    const user_id = req.userId;

    // Si la devise n'est pas spécifiée, mettre FC par défaut
    const productCurrency = currency || 'FC';

    const result = await pool.query(
      `INSERT INTO products (user_id, name, description, price_ht, tva_rate, currency) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [user_id, name, description, price_ht, tva_rate || 20, productCurrency]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error('Erreur création produit:', error);
    res.status(500).json({ message: 'Erreur lors de la création du produit' });
  }
};

// Récupérer tous les produits
const getProducts = async (req, res) => {
  try {
    const user_id = req.userId;
    const result = await pool.query(
      'SELECT * FROM products WHERE user_id = $1 ORDER BY name ASC',
      [user_id]
    );
    res.json(result.rows);

  } catch (error) {
    console.error('Erreur récupération produits:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des produits' });
  }
};

// Modifier un produit
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price_ht, tva_rate, currency } = req.body;
    const user_id = req.userId;

    const result = await pool.query(
      `UPDATE products 
       SET name = $1, description = $2, price_ht = $3, tva_rate = $4, currency = $5
       WHERE id = $6 AND user_id = $7 
       RETURNING *`,
      [name, description, price_ht, tva_rate, currency, id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Erreur mise à jour produit:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du produit' });
  }
};

// Supprimer un produit
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.userId;

    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.json({ message: 'Produit supprimé avec succès' });

  } catch (error) {
    console.error('Erreur suppression produit:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du produit' });
  }
};

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct
};