const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, BorderStyle, HeadingLevel, AlignmentType, WidthType, convertInchesToTwip } = require('docx');

// Fonction pour générer une facture en Word
const generateInvoiceWord = async (invoice, items, companyInfo) => {
  try {
    const currency = invoice.currency || 'FC';

    // Créer le document
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
            },
          },
        },
        children: [
          // ===== EN-TÊTE =====
          new Paragraph({
            children: [
              new TextRun({
                text: 'NK CONSULTING',
                size: 36,
                bold: true,
                color: '1B5E20',
                font: 'Arial',
              }),
            ],
            alignment: AlignmentType.LEFT,
            spacing: { after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: companyInfo?.company_name || 'NK Consulting S.A.R.L',
                size: 18,
                color: '666666',
                font: 'Arial',
              }),
            ],
            spacing: { after: 0 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: companyInfo?.company_address || 'Kinshasa, RDC',
                size: 16,
                color: '666666',
                font: 'Arial',
              }),
            ],
            spacing: { after: 0 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Tél: ${companyInfo?.company_phone || 'Non renseigné'} | Email: ${companyInfo?.email || 'contact@nkconsulting.cd'}`,
                size: 16,
                color: '666666',
                font: 'Arial',
              }),
            ],
            spacing: { after: 200 },
          }),

          // ===== TITRE FACTURE =====
          new Paragraph({
            children: [
              new TextRun({
                text: 'FACTURE',
                size: 28,
                bold: true,
                color: '1a1a1a',
                font: 'Arial',
              }),
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `N° ${invoice.invoice_number}`,
                size: 18,
                color: '1a1a1a',
                font: 'Arial',
              }),
              new TextRun({
                text: `    |    Date: ${new Date(invoice.issue_date).toLocaleDateString('fr-FR')}`,
                size: 18,
                color: '1a1a1a',
                font: 'Arial',
              }),
              new TextRun({
                text: `    |    Échéance: ${new Date(invoice.due_date).toLocaleDateString('fr-FR')}`,
                size: 18,
                color: '1a1a1a',
                font: 'Arial',
              }),
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { after: 200 },
          }),

          // ===== CLIENT =====
          new Paragraph({
            children: [
              new TextRun({
                text: 'Facturé à :',
                size: 18,
                bold: true,
                color: '1a1a1a',
                font: 'Arial',
              }),
            ],
            spacing: { after: 80 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: invoice.client_name || 'Client non renseigné',
                size: 16,
                color: '333333',
                font: 'Arial',
              }),
            ],
            spacing: { after: 0 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: invoice.client_address || '',
                size: 16,
                color: '333333',
                font: 'Arial',
              }),
            ],
            spacing: { after: 0 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: invoice.client_email || '',
                size: 16,
                color: '333333',
                font: 'Arial',
              }),
            ],
            spacing: { after: 300 },
          }),

          // ===== TABLEAU DES PRODUITS =====
          new Table({
            rows: [
              // En-tête
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'Description',
                            size: 18,
                            bold: true,
                            color: 'FFFFFF',
                            font: 'Arial',
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: { fill: '1B5E20' },
                    width: { size: 40, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'Qté',
                            size: 18,
                            bold: true,
                            color: 'FFFFFF',
                            font: 'Arial',
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: { fill: '1B5E20' },
                    width: { size: 15, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `Prix HT (${currency})`,
                            size: 18,
                            bold: true,
                            color: 'FFFFFF',
                            font: 'Arial',
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: { fill: '1B5E20' },
                    width: { size: 15, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'TVA %',
                            size: 18,
                            bold: true,
                            color: 'FFFFFF',
                            font: 'Arial',
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: { fill: '1B5E20' },
                    width: { size: 10, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `Total HT (${currency})`,
                            size: 18,
                            bold: true,
                            color: 'FFFFFF',
                            font: 'Arial',
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: { fill: '1B5E20' },
                    width: { size: 20, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              // Lignes des produits
              ...items.map((item) => {
                const description = item.description || 'Service';
                const quantity = item.quantity || 1;
                const unitPrice = item.unit_price_ht || 0;
                const tvaRate = item.tva_rate || 20;
                const totalHT = (quantity * unitPrice) || 0;

                return new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: description,
                              size: 14,
                              color: '333333',
                              font: 'Arial',
                            }),
                          ],
                          alignment: AlignmentType.LEFT,
                        }),
                      ],
                      width: { size: 40, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: quantity.toString(),
                              size: 14,
                              color: '333333',
                              font: 'Arial',
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                      width: { size: 15, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: unitPrice.toFixed(2),
                              size: 14,
                              color: '333333',
                              font: 'Arial',
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                      width: { size: 15, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: `${tvaRate}%`,
                              size: 14,
                              color: '333333',
                              font: 'Arial',
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                      width: { size: 10, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: totalHT.toFixed(2),
                              size: 14,
                              color: '333333',
                              font: 'Arial',
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                      width: { size: 20, type: WidthType.PERCENTAGE },
                    }),
                  ],
                });
              }),
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),

          // ===== TOTAUX =====
          new Paragraph({
            children: [
              new TextRun({
                text: '',
                size: 14,
                font: 'Arial',
              }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Total HT: ${invoice.total_ht?.toFixed(2) || '0.00'} ${currency}`,
                size: 18,
                bold: true,
                color: '1a1a1a',
                font: 'Arial',
              }),
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { after: 80 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `TVA: ${invoice.total_tva?.toFixed(2) || '0.00'} ${currency}`,
                size: 16,
                color: '666666',
                font: 'Arial',
              }),
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { after: 80 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `TOTAL TTC: ${invoice.total_ttc?.toFixed(2) || '0.00'} ${currency}`,
                size: 22,
                bold: true,
                color: '1B5E20',
                font: 'Arial',
              }),
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { after: 400 },
          }),

          // ===== NOTES =====
          ...(invoice.notes ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Notes :',
                  size: 16,
                  bold: true,
                  color: '1a1a1a',
                  font: 'Arial',
                }),
              ],
              spacing: { after: 80 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: invoice.notes,
                  size: 14,
                  color: '666666',
                  font: 'Arial',
                }),
              ],
              spacing: { after: 200 },
            }),
          ] : []),

          // ===== PIED DE PAGE =====
          new Paragraph({
            children: [
              new TextRun({
                text: 'NK Consulting S.A.R.L - République Démocratique du Congo',
                size: 12,
                color: '999999',
                font: 'Arial',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Facture générée le ${new Date().toLocaleDateString('fr-FR')} - Devise: ${currency}`,
                size: 10,
                color: '999999',
                font: 'Arial',
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ],
      }],
    });

    // Générer le buffer
    const buffer = await Packer.toBuffer(doc);
    return buffer;

  } catch (error) {
    console.error('Erreur génération Word:', error);
    throw error;
  }
};

module.exports = { generateInvoiceWord };