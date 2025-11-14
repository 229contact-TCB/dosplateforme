import { CompanySettings, Client, ProformaItem } from '../lib/supabase';

interface ProformaPDFData {
  company: CompanySettings;
  client: Client;
  invoiceNumber: string;
  date: string;
  items: ProformaItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  paymentTerms: string;
}

export async function generateProformaPDF(data: ProformaPDFData) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCIPExpiry = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data.company.qr_code_url)}`;

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Facture Pro Forma - ${data.invoiceNumber}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      font-size: 14px;
      line-height: 1.4;
    }

    .header {
      background-color: #012B59;
      color: white;
      padding: 20px;
      margin-bottom: 20px;
    }

    .company-info {
      margin-bottom: 30px;
    }

    .company-name {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .title {
      font-size: 28px;
      font-weight: bold;
      text-align: right;
      margin-top: -60px;
    }

    .info-line {
      margin-bottom: 2px;
      font-size: 13px;
    }

    .section {
      margin-bottom: 20px;
    }

    .section-title {
      font-weight: bold;
      margin-bottom: 5px;
      font-size: 14px;
    }

    .client-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      padding-top: 20px;
      border-top: 2px solid #012B59;
    }

    .client-info {
      flex: 1;
    }

    .qr-section {
      text-align: right;
    }

    .qr-code {
      width: 120px;
      height: 120px;
    }

    .invoice-meta {
      text-align: right;
      margin-top: 10px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }

    th {
      background-color: #012B59;
      color: white;
      padding: 12px 8px;
      text-align: left;
      font-weight: bold;
      font-size: 13px;
    }

    td {
      padding: 10px 8px;
      border-bottom: 1px solid #e0e0e0;
    }

    tr:nth-child(even) {
      background-color: #f5f5f5;
    }

    .text-right {
      text-align: right;
    }

    .text-center {
      text-align: center;
    }

    .totals {
      margin-top: 20px;
      text-align: right;
    }

    .total-row {
      margin-bottom: 8px;
      font-size: 15px;
    }

    .total-label {
      display: inline-block;
      min-width: 200px;
      font-weight: bold;
    }

    .total-value {
      display: inline-block;
      min-width: 150px;
      text-align: right;
    }

    .final-total {
      background-color: #012B59;
      color: white;
      padding: 12px;
      margin-top: 10px;
      font-size: 18px;
      font-weight: bold;
    }

    .payment-section {
      margin-top: 30px;
      margin-bottom: 30px;
    }

    .payment-title {
      font-weight: bold;
      font-size: 14px;
      margin-bottom: 5px;
    }

    .thank-you {
      text-align: center;
      font-style: italic;
      color: #666;
      margin: 40px 0 20px 0;
    }

    .footer {
      text-align: center;
      border-top: 2px solid #012B59;
      padding-top: 15px;
      margin-top: 40px;
    }

    .footer-company {
      font-weight: bold;
      margin-bottom: 5px;
    }

    .footer-activity {
      font-size: 12px;
      color: #666;
    }

    .developer-credit {
      text-align: center;
      font-size: 11px;
      color: #666;
      margin-top: 20px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-info">
      <div class="company-name">${data.company.name}</div>
      <div class="info-line">Tél : ${data.company.phones}</div>
      <div class="info-line">N° CIP : ${data.company.cip} – Expire le : ${formatCIPExpiry(data.company.cip_expiry)}</div>
      <div class="info-line">IFU : ${data.company.ifu}</div>
      <div class="info-line">Email : ${data.company.email}</div>
      ${data.company.rccm ? `<div class="info-line">RCCM : ${data.company.rccm}</div>` : ''}
    </div>
    <div class="title">FACTURE PRO FORMA</div>
  </div>

  <div class="client-section">
    <div class="client-info">
      <div class="section-title">Le Client</div>
      <div style="font-weight: bold; font-size: 16px; margin-top: 5px;">${data.client.name}</div>
      ${data.client.phone ? `<div>${data.client.phone}</div>` : ''}
      ${data.client.email ? `<div>${data.client.email}</div>` : ''}
      ${data.client.address ? `<div>${data.client.address}</div>` : ''}
    </div>
    <div class="qr-section">
      <img src="${qrCodeUrl}" alt="QR Code" class="qr-code" />
      <div class="invoice-meta">
        <div style="font-weight: bold;">Invoice no : ${data.invoiceNumber}</div>
        <div>${formatDate(data.date)}</div>
      </div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 8%;">NO</th>
        <th style="width: 42%;">DESIGNATION</th>
        <th style="width: 12%;" class="text-center">QUANTITÉ</th>
        <th style="width: 18%;" class="text-right">PRIX</th>
        <th style="width: 20%;" class="text-right">MONTANT</th>
      </tr>
    </thead>
    <tbody>
      ${data.items.map((item, index) => `
        <tr>
          <td class="text-center">${index + 1}</td>
          <td>${item.designation}</td>
          <td class="text-center">${Number(item.quantity).toLocaleString('fr-FR')}</td>
          <td class="text-right">${Number(item.unit_price).toLocaleString('fr-FR')} FCFA</td>
          <td class="text-right">${Number(item.amount).toLocaleString('fr-FR')} FCFA</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="total-row">
      <span class="total-label">Montant Total</span>
      <span class="total-value">${data.subtotal.toLocaleString('fr-FR')} FCFA</span>
    </div>
    ${data.taxAmount > 0 ? `
      <div class="total-row">
        <span class="total-label">Tax 0% :</span>
        <span class="total-value">${data.taxAmount.toLocaleString('fr-FR')} FCFA</span>
      </div>
    ` : `
      <div class="total-row">
        <span class="total-label">Tax 0% :</span>
        <span class="total-value">0 FCFA</span>
      </div>
    `}
    <div class="final-total">
      <span class="total-label">MONTANT TTC :</span>
      <span class="total-value">${data.total.toLocaleString('fr-FR')} FCFA</span>
    </div>
  </div>

  <div class="payment-section">
    <div class="payment-title">CONDITION ET METHODE DE PAIEMENT :</div>
    <div>${data.paymentTerms || 'Paiement à la livraison'}</div>
  </div>

  <div class="thank-you">
    Thank you for your business with us!
  </div>

  <div class="footer">
    ${data.company.manager_name ? `<div style="margin-bottom: 30px; text-align: right; padding-right: 50px;">${data.company.manager_name}</div>` : '<div style="margin-bottom: 30px;"></div>'}
    <div class="footer-company">${data.company.name}</div>
    <div class="footer-activity">${data.company.activity}</div>
  </div>

  
</body>
</html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
}
