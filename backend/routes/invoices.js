const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../config/db');
const { generateInvoicePDF } = require('../utils/pdfGenerator');

// Importer les contrôleurs
const invoiceController = require('../controllers/invoiceController');

router.use(auth);

// Routes CRUD
router.post('/', invoiceController.createInvoice);
router.get('/', invoiceController.getInvoices);
router.get('/:id', invoiceController.getInvoiceById);
router.put('/:id/status', invoiceController.updateInvoiceStatus);
router.delete('/:id', invoiceController.deleteInvoice);

// ===== TÉLÉCHARGEMENT PDF =====
router.get('/:id/pdf', async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.userId;

    console.log('📄 Génération PDF pour la facture:', id);

    // Récupérer la facture
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
    console.log('✅ Facture trouvée:', invoice.invoice_number);

    // Récupérer les items
    const itemsResult = await pool.query(
      `SELECT * FROM invoice_items WHERE invoice_id = $1`,
      [id]
    );
    console.log('✅ Items trouvés:', itemsResult.rows.length);

    // Récupérer les infos de l'entreprise
    const companyResult = await pool.query(
      `SELECT company_name, company_address, company_phone, email FROM users WHERE id = $1`,
      [user_id]
    );
    const companyInfo = companyResult.rows[0] || {};

    // Générer le PDF
    const pdfBuffer = await generateInvoicePDF(invoice, itemsResult.rows, companyInfo);
    console.log('✅ PDF généré avec succès');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=facture_${invoice.invoice_number}.pdf`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('❌ Erreur génération PDF:', error);
    res.status(500).json({ message: 'Erreur lors de la génération du PDF: ' + error.message });
  }
});

// ===== TÉLÉCHARGEMENT WORD =====
router.get('/:id/word', async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.userId;

    console.log('📝 Génération Word pour la facture:', id);

    // Récupérer la facture
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

    // Récupérer les items
    const itemsResult = await pool.query(
      `SELECT * FROM invoice_items WHERE invoice_id = $1`,
      [id]
    );

    // Récupérer les infos de l'entreprise
    const companyResult = await pool.query(
      `SELECT company_name, company_address, company_phone, email FROM users WHERE id = $1`,
      [user_id]
    );
    const companyInfo = companyResult.rows[0] || {};

    // Générer le Word avec docx
    const { generateInvoiceWord } = require('../utils/wordGenerator');
    const wordBuffer = await generateInvoiceWord(invoice, itemsResult.rows, companyInfo);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename=facture_${invoice.invoice_number}.docx`);
    res.send(wordBuffer);

  } catch (error) {
    console.error('❌ Erreur génération Word:', error);
    res.status(500).json({ message: 'Erreur lors de la génération du Word: ' + error.message });
  }
});

module.exports = router;