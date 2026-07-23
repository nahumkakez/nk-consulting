const PDFDocument = require('pdfkit');

const generateInvoicePDF = async (invoice, items, companyInfo) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // En-tête
      doc.fontSize(24).font('Helvetica-Bold').fillColor('#1B5E20').text('NK CONSULTING', 50, 50);
      doc.fontSize(10).font('Helvetica').fillColor('#666666')
         .text(companyInfo?.company_name || 'NK Consulting S.A.R.L', 50, 80)
         .text(companyInfo?.company_address || 'Kinshasa, RDC', 50, 95)
         .text(`Tél: ${companyInfo?.company_phone || 'Non renseigné'}`, 50, 110)
         .text(`Email: ${companyInfo?.email || 'contact@nkconsulting.cd'}`, 50, 125);

      // Numéro de facture
      doc.fontSize(16).font('Helvetica-Bold').fillColor('#1a1a1a')
         .text('FACTURE', 450, 50)
         .fontSize(12).font('Helvetica')
         .text(`N° ${invoice.invoice_number}`, 450, 75)
         .text(`Date: ${new Date(invoice.issue_date).toLocaleDateString('fr-FR')}`, 450, 95)
         .text(`Échéance: ${new Date(invoice.due_date).toLocaleDateString('fr-FR')}`, 450, 115);

      // Ligne séparatrice
      doc.strokeColor('#1B5E20').lineWidth(2).moveTo(50, 150).lineTo(550, 150).stroke();

      // Client
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#1a1a1a').text('Facturé à :', 50, 170);
      doc.fontSize(11).font('Helvetica').fillColor('#333333')
         .text(invoice.client_name || 'Client non renseigné', 50, 190)
         .text(invoice.client_address || '', 50, 207)
         .text(invoice.client_email || '', 50, 224);

      // Tableau
      const tableTop = 260;
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#ffffff')
         .rect(50, tableTop, 510, 25).fill('#1B5E20')
         .fillColor('#ffffff')
         .text('Description', 60, tableTop + 8)
         .text('Qté', 200, tableTop + 8)
         .text('Prix HT', 260, tableTop + 8)
         .text('TVA %', 340, tableTop + 8)
         .text('Total HT', 420, tableTop + 8);

      let yPos = tableTop + 35;
      doc.fillColor('#333333').font('Helvetica').fontSize(9);

      items.forEach((item, index) => {
        if (yPos > 750) { doc.addPage(); yPos = 50; }
        if (index % 2 === 0) {
          doc.rect(50, yPos - 5, 510, 22).fill('#f8f9fa');
          doc.fillColor('#333333');
        }
        const totalHT = (item.quantity || 1) * (item.unit_price_ht || 0);
        doc.text((item.description || 'Service').substring(0, 25), 60, yPos)
           .text((item.quantity || 1).toString(), 200, yPos)
           .text((item.unit_price_ht || 0).toFixed(2), 260, yPos)
           .text(`${item.tva_rate || 20}%`, 340, yPos)
           .text(totalHT.toFixed(2), 420, yPos);
        yPos += 22;
      });

      // Totaux
      const totalY = yPos + 20;
      doc.fontSize(11).font('Helvetica')
         .strokeColor('#e9ecef').lineWidth(1).moveTo(350, totalY).lineTo(560, totalY).stroke();

      doc.font('Helvetica-Bold').fillColor('#1a1a1a')
         .text('Total HT', 350, totalY + 10)
         .text(`${(invoice.total_ht || 0).toFixed(2)} ${invoice.currency || 'FC'}`, 480, totalY + 10, { align: 'right' });

      doc.font('Helvetica')
         .text('TVA', 350, totalY + 30)
         .text(`${(invoice.total_tva || 0).toFixed(2)} ${invoice.currency || 'FC'}`, 480, totalY + 30, { align: 'right' });

      doc.font('Helvetica-Bold').fillColor('#1B5E20').fontSize(14)
         .text('Total TTC', 350, totalY + 55)
         .text(`${(invoice.total_ttc || 0).toFixed(2)} ${invoice.currency || 'FC'}`, 480, totalY + 55, { align: 'right' });

      // Notes
      if (invoice.notes) {
        const notesY = totalY + 100;
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#1a1a1a').text('Notes :', 50, notesY);
        doc.font('Helvetica').fontSize(9).fillColor('#666666').text(invoice.notes, 50, notesY + 18, { width: 450 });
      }

      // Pied de page
      doc.fontSize(8).font('Helvetica').fillColor('#999999')
         .text('NK Consulting S.A.R.L - République Démocratique du Congo', 50, 780, { align: 'center', width: 510 })
         .text(`Facture générée le ${new Date().toLocaleDateString('fr-FR')} - Devise: ${invoice.currency || 'FC'}`, 50, 795, { align: 'center', width: 510 });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateInvoicePDF };