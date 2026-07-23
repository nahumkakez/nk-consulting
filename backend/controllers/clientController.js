const pool = require('../config/db');

// Créer un client
const createClient = async (req, res) => {
  try {
    const { name, email, phone, address, siret } = req.body;
    const user_id = req.userId;

    const result = await pool.query(
      `INSERT INTO clients (user_id, name, email, phone, address, siret) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [user_id, name, email, phone, address, siret]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error('Erreur création client:', error);
    res.status(500).json({ message: 'Erreur lors de la création du client' });
  }
};

// Récupérer tous les clients
const getClients = async (req, res) => {
  try {
    const user_id = req.userId;
    const result = await pool.query(
      'SELECT * FROM clients WHERE user_id = $1 ORDER BY name ASC',
      [user_id]
    );
    res.json(result.rows);

  } catch (error) {
    console.error('Erreur récupération clients:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des clients' });
  }
};

// Récupérer un client
const getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.userId;

    const result = await pool.query(
      'SELECT * FROM clients WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Erreur récupération client:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du client' });
  }
};

// Modifier un client
const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, siret } = req.body;
    const user_id = req.userId;

    const result = await pool.query(
      `UPDATE clients 
       SET name = $1, email = $2, phone = $3, address = $4, siret = $5 
       WHERE id = $6 AND user_id = $7 
       RETURNING *`,
      [name, email, phone, address, siret, id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Erreur mise à jour client:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du client' });
  }
};

// Supprimer un client
const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.userId;

    const result = await pool.query(
      'DELETE FROM clients WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }

    res.json({ message: 'Client supprimé avec succès' });

  } catch (error) {
    console.error('Erreur suppression client:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du client' });
  }
};

module.exports = {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient
};