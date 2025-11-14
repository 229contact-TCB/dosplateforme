import { useEffect, useState } from 'react';
import { Download, Edit2 } from 'lucide-react';
import { supabase, Proforma, ProformaItem } from '../lib/supabase';
import Header from '../components/Header';
import { generateProformaPDF } from '../utils/pdfGenerator';

interface ProformasProps {
  onNavigate: (page: string, data?: unknown) => void;
}

export default function Proformas({ onNavigate }: ProformasProps) {
  const [proformas, setProformas] = useState<Proforma[]>([]);

  useEffect(() => {
    loadProformas();
  }, []);

  const loadProformas = async () => {
    const { data } = await supabase
      .from('proformas')
      .select('*')
      .order('date', { ascending: false });
    if (data) setProformas(data);
  };

  const handleDownload = async (proforma: Proforma) => {
    const [settingsRes, clientRes, itemsRes] = await Promise.all([
      supabase.from('company_settings').select('*').limit(1).maybeSingle(),
      supabase.from('clients').select('*').eq('id', proforma.client_id).maybeSingle(),
      supabase.from('proforma_items').select('*').eq('proforma_id', proforma.id)
    ]);

    if (!settingsRes.data || !clientRes.data || !itemsRes.data) {
      alert('Erreur lors du chargement des données');
      return;
    }

    const items: ProformaItem[] = itemsRes.data.map(item => ({
      designation: item.designation,
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
      discount_type: item.discount_type as 'none' | 'percentage' | 'amount',
      discount_value: Number(item.discount_value),
      amount: Number(item.amount)
    }));

    await generateProformaPDF({
      company: settingsRes.data,
      client: clientRes.data,
      invoiceNumber: proforma.invoice_number,
      date: proforma.date,
      items,
      subtotal: Number(proforma.subtotal),
      taxAmount: Number(proforma.tax_amount),
      total: Number(proforma.total),
      paymentTerms: proforma.payment_terms,
    });
  };

  const handleEdit = (proforma: Proforma) => {
    onNavigate('new-proforma', {
      id: proforma.id,
      invoice_number: proforma.invoice_number,
      client_id: proforma.client_id,
      client_name: proforma.client_name,
      date: proforma.date,
      tax_rate: proforma.tax_rate,
      payment_terms: proforma.payment_terms,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Historique des Proformas" />

      <div className="p-4 space-y-3">
        {proformas.map((proforma) => (
          <div
            key={proforma.id}
            className="bg-white rounded-lg shadow p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-gray-800">
                  Facture N° {proforma.invoice_number}
                </h3>
                <p className="text-sm text-gray-600">{proforma.client_name}</p>
                <p className="text-xs text-gray-500">{formatDate(proforma.date)}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-[#012B59]">
                  {Number(proforma.total).toLocaleString()} FCFA
                </p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(proforma)}
                className="flex-1 bg-blue-500 text-white rounded-lg py-2 px-3 flex items-center justify-center space-x-1 text-sm hover:bg-blue-600"
              >
                <Edit2 size={16} />
                <span>Modifier</span>
              </button>
              <button
                onClick={() => handleDownload(proforma)}
                className="flex-1 bg-[#012B59] text-white rounded-lg py-2 px-3 flex items-center justify-center space-x-1 text-sm hover:bg-[#01203f]"
              >
                <Download size={16} />
                <span>PDF</span>
              </button>
            </div>
          </div>
        ))}

        {proformas.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucune proforma enregistrée
          </div>
        )}
      </div>
    </div>
  );
}
