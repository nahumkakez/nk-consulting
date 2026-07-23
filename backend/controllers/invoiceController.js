const pool = require('../config/db');

// Générer un numéro de facture unique
const generateInvoiceNumber = async () => {
  const year = new Date().getFullYear();
  const result = await pool.query(
    `SELECT COUNT(*) as count FROM invoices WHERE EXTRACT(YEAR FROM issue_date) = $1`,
    [year]
  );
  const count = parseInt(result.rows[0].count) + 1;
  return `FACT-${year}-${String(count).padStart(4, '0')}`;
};

// Créer une facture
const createInvoice = async (req, res) => {
  try {
    const { client_id, issue_date, due_date, items, notes, currency } = req.body;
    const user_id = req.userId;

    const invoice_number = await generateInvoiceNumber();
    const invoiceCurrency = currency || 'FC';

    let total_ht = 0;
    let total_tva = 0;
    let total_ttc = 0;

    const calculatedItems = items.map(item => {
      const item_ht = item.quantity * item.unit_price_ht;
      const item_tva = item_ht * (item.tva_rate / 100);
      const item_ttc = item_ht + item_tva;
      
      total_ht += item_ht;
      total_tva += item_tva;
      total_ttc += item_ttc;

      return {
        ...item,
        total_ht: item_ht,
        total_tva: item_tva,
        total_ttc: item_ttc
      };
    });

    const invoiceResult = await pool.query(
      `INSERT INTO invoices 
       (user_id, client_id, invoice_number, issue_date, due_date, status, 
        total_ht, total_tva, total_ttc, notes, currency) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
       RETURNING *`,
      [user_id, client_id, invoice_number, issue_date, due_date, 'draft',
       total_ht, total_tva, total_ttc, notes, invoiceCurrency]
    );

    const invoice = invoiceResult.rows[0];

    for (const item of calculatedItems) {
      await pool.query(
        `INSERT INTO invoice_items 
         (invoice_id, product_id, description, quantity, unit_price_ht, 
          tva_rate, total_ht, total_tva, total_ttc, currency) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [invoice.id, item.product_id, item.description, item.quantity, 
         item.unit_price_ht, item.tva_rate, item.total_ht, item.total_tva, 
         item.total_ttc, invoiceCurrency]
      );
    }

    res.status(201).json({
      message: 'Facture créée avec succès',
      invoice,
      items: calculatedItems
    });

  } catch (error) {
    console.error('Erreur création facture:', error);
    res.status(500).json({ message: 'Erreur lors de la création de la facture' });
  }
};

// Récupérer toutes les factures
const getInvoices = async (req, res) => {
  try {
    const user_id = req.userId;
    
    const result = await pool.query(
      `SELECT i.*, c.name as client_name 
       FROM invoices i 
       LEFT JOIN clients c ON i.client_id = c.id 
       WHERE i.user_id = $1 
       ORDER BY i.created_at DESC`,
      [user_id]
    );

    res.json(result.rows);

  } catch (error) {
    console.error('Erreur récupération factures:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des factures' });
  }
};

// Récupérer une facture avec ses détails
const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.userId;

    const invoiceResult = await pool.query(
      `SELECT i.*, c.name as client_name, c.email as client_email, c.address as client_address
       FROM invoices i 
       LEFT JOIN clients c ON i.client_id = c.id 
       WHERE i.id = $1 AND i.user_id = $2`,
      [id, user_id]
    );

    if (invoiceResult.rows.length === 0) {
      return res.status(404).json({ message: 'Facture non trouvée' });
    }

    const invoice = invoiceResult.rows[0];

    const itemsResult = await pool.query(
      `SELECT * FROM invoice_items WHERE invoice_id = $1`,
      [id]
    );

    res.json({
      invoice,
      items: itemsResult.rows
    });

  } catch (error) {
    console.error('Erreur récupération facture:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la facture' });
  }
};

// Mettre à jour le statut d'une facture
const updateInvoiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user_id = req.userId;

    const checkResult = await pool.query(
      'SELECT * FROM invoices WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Facture non trouvée' });
    }

    const result = await pool.query(
      'UPDATE invoices SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (status === 'paid') {
      const invoice = result.rows[0];
      await pool.query(
        `INSERT INTO journal_entries 
         (user_id, invoice_id, entry_date, description, account_debit, account_credit, amount) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [user_id, invoice.id, new Date(), `Facture ${invoice.invoice_number} payée`, 
         '411', '706', invoice.total_ttc]
      );
    }

    res.json({
      message: 'Statut de la facture mis à jour',
      invoice: result.rows[0]
    });

  } catch (error) {
    console.error('Erreur mise à jour statut:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du statut' });
  }
};

// Supprimer une facture
const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.userId;

    const result = await pool.query(
      'DELETE FROM invoices WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Facture non trouvée' });
    }

    res.json({ message: 'Facture supprimée avec succès' });

  } catch (error) {
    console.error('Erreur suppression facture:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};

// EXPORTER TOUTES LES FONCTIONS
module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoiceStatus,
  deleteInvoice
};