import { useEffect, useState } from 'react';
import { Plus, Trash2, X, Download, Save } from 'lucide-react';
import { supabase, Client, Article, ProformaItem, CompanySettings } from '../lib/supabase';
import Header from '../components/Header';
import { generateProformaPDF } from '../utils/pdfGenerator';

interface NewProformaProps {
  editingProforma?: {
    id: string;
    invoice_number: string;
    client_id: string;
    client_name: string;
    date: string;
    tax_rate: number;
    payment_terms: string;
  };
  onNavigate: (page: string) => void;
}

export default function NewProforma({ editingProforma, onNavigate }: NewProformaProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(editingProforma?.client_id || '');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState(editingProforma?.invoice_number || '');
  const [invoiceDate, setInvoiceDate] = useState(editingProforma?.date || new Date().toISOString().split('T')[0]);
  const [hasTax, setHasTax] = useState((editingProforma?.tax_rate || 0) > 0);
  const [paymentTerms, setPaymentTerms] = useState(editingProforma?.payment_terms || 'Paiement à la livraison');
  const [items, setItems] = useState<ProformaItem[]>([
    { designation: '', quantity: 1, unit_price: 0, discount_type: 'none', discount_value: 0, amount: 0 }
  ]);
  const [clientForm, setClientForm] = useState({ name: '', phone: '', email: '', address: '' });

  useEffect(() => {
    loadData();
    if (editingProforma) {
      loadProformaItems(editingProforma.id);
    }
  }, []);

  useEffect(() => {
    if (!editingProforma && !invoiceNumber) {
      generateInvoiceNumber();
    }
  }, []);

  useEffect(() => {
    if (selectedClientId) {
      const client = clients.find(c => c.id === selectedClientId);
      setSelectedClient(client || null);
    }
  }, [selectedClientId, clients]);

  const loadData = async () => {
    const [clientsRes, articlesRes, settingsRes] = await Promise.all([
      supabase.from('clients').select('*').order('name'),
      supabase.from('articles').select('*').order('designation'),
      supabase.from('company_settings').select('*').limit(1).maybeSingle()
    ]);

    if (clientsRes.data) setClients(clientsRes.data);
    if (articlesRes.data) setArticles(articlesRes.data);
    if (settingsRes.data) setCompanySettings(settingsRes.data);
  };

  const loadProformaItems = async (proformaId: string) => {
    const { data } = await supabase
      .from('proforma_items')
      .select('*')
      .eq('proforma_id', proformaId);

    if (data && data.length > 0) {
      setItems(data.map(item => ({
        designation: item.designation,
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        discount_type: item.discount_type as 'none' | 'percentage' | 'amount',
        discount_value: Number(item.discount_value),
        amount: Number(item.amount)
      })));
    }
  };

  const generateInvoiceNumber = async () => {
    const { data } = await supabase
      .from('proformas')
      .select('invoice_number')
      .order('created_at', { ascending: false })
      .limit(1);

    if (data && data.length > 0) {
      const lastNumber = parseInt(data[0].invoice_number.replace(/\D/g, '')) || 0;
      setInvoiceNumber(String(lastNumber + 1).padStart(5, '0'));
    } else {
      setInvoiceNumber('00001');
    }
  };

  const addItem = () => {
    setItems([...items, { designation: '', quantity: 1, unit_price: 0, discount_type: 'none', discount_value: 0, amount: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof ProformaItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    const item = newItems[index];
    let amount = item.quantity * item.unit_price;

    if (item.discount_type === 'percentage') {
      amount -= amount * (item.discount_value / 100);
    } else if (item.discount_type === 'amount') {
      amount -= item.discount_value;
    }

    newItems[index].amount = Math.max(0, amount);
    setItems(newItems);
  };

  const selectArticle = (index: number, articleId: string) => {
    const article = articles.find(a => a.id === articleId);
    if (article) {
      updateItem(index, 'designation', article.designation);
      updateItem(index, 'unit_price', Number(article.unit_price));
    }
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = hasTax ? subtotal * 0.18 : 0;
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  };

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await supabase.from('clients').insert([clientForm]).select().single();
    if (data) {
      setClients([...clients, data]);
      setSelectedClientId(data.id);
      setShowClientModal(false);
      setClientForm({ name: '', phone: '', email: '', address: '' });
    }
  };

  const handleSave = async () => {
    if (!selectedClientId || !invoiceNumber || items.length === 0) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const { subtotal, taxAmount, total } = calculateTotals();
    const client = clients.find(c => c.id === selectedClientId);

    const proformaData = {
      invoice_number: invoiceNumber,
      client_id: selectedClientId,
      client_name: client?.name || '',
      date: invoiceDate,
      subtotal,
      tax_rate: hasTax ? 18 : 0,
      tax_amount: taxAmount,
      total,
      payment_terms: paymentTerms,
    };

    if (editingProforma) {
      await supabase.from('proformas').update(proformaData).eq('id', editingProforma.id);
      await supabase.from('proforma_items').delete().eq('proforma_id', editingProforma.id);

      const itemsData = items.map(item => ({
        proforma_id: editingProforma.id,
        ...item
      }));
      await supabase.from('proforma_items').insert(itemsData);
    } else {
      const { data: proforma } = await supabase
        .from('proformas')
        .insert([proformaData])
        .select()
        .single();

      if (proforma) {
        const itemsData = items.map(item => ({
          proforma_id: proforma.id,
          ...item
        }));
        await supabase.from('proforma_items').insert(itemsData);
      }
    }

    alert('Proforma enregistrée avec succès');
    onNavigate('proformas');
  };

  const handleDownloadPDF = async () => {
    if (!companySettings || !selectedClient) {
      alert('Veuillez sélectionner un client');
      return;
    }

    const { subtotal, taxAmount, total } = calculateTotals();

    await generateProformaPDF({
      company: companySettings,
      client: selectedClient,
      invoiceNumber,
      date: invoiceDate,
      items,
      subtotal,
      taxAmount,
      total,
      paymentTerms,
    });
  };

  const { subtotal, taxAmount, total } = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title={editingProforma ? "Modifier Proforma" : "Nouvelle Proforma"} />

      <div className="p-4 space-y-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Informations générales</h2>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de facture *
              </label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#012B59]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#012B59]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client *
              </label>
              <div className="flex space-x-2">
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#012B59]"
                  required
                >
                  <option value="">Sélectionner un client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowClientModal(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-800">Articles</h2>
            <button
              onClick={addItem}
              className="bg-[#012B59] text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-1 hover:bg-[#01203f]"
            >
              <Plus size={16} />
              <span>Ligne</span>
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Article {index + 1}</span>
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Article rapide</label>
                  <select
                    onChange={(e) => selectArticle(index, e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value="">Sélectionner un article</option>
                    {articles.map(article => (
                      <option key={article.id} value={article.id}>{article.designation}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Désignation *</label>
                  <input
                    type="text"
                    value={item.designation}
                    onChange={(e) => updateItem(index, 'designation', e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Quantité *</label>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Prix unitaire *</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unit_price}
                      onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Type réduction</label>
                    <select
                      value={item.discount_type}
                      onChange={(e) => updateItem(index, 'discount_type', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value="none">Aucune</option>
                      <option value="percentage">Pourcentage</option>
                      <option value="amount">Montant</option>
                    </select>
                  </div>
                  {item.discount_type !== 'none' && (
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Réduction {item.discount_type === 'percentage' ? '(%)' : '(FCFA)'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.discount_value}
                        onChange={(e) => updateItem(index, 'discount_value', parseFloat(e.target.value) || 0)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 rounded px-2 py-1">
                  <span className="text-xs text-gray-600">Montant: </span>
                  <span className="text-sm font-bold text-[#012B59]">
                    {item.amount.toLocaleString()} FCFA
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-3">
            <input
              type="checkbox"
              id="hasTax"
              checked={hasTax}
              onChange={(e) => setHasTax(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="hasTax" className="text-sm font-medium text-gray-700">
              Appliquer la TVA 18%
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Conditions de paiement
            </label>
            <textarea
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#012B59]"
              rows={2}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Totaux</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700">Montant total:</span>
              <span className="font-bold">{subtotal.toLocaleString()} FCFA</span>
            </div>
            {hasTax && (
              <div className="flex justify-between">
                <span className="text-gray-700">TVA 18%:</span>
                <span className="font-bold">{taxAmount.toLocaleString()} FCFA</span>
              </div>
            )}
            <div className="flex justify-between text-lg border-t pt-2">
              <span className="text-gray-800 font-bold">Montant TTC:</span>
              <span className="font-bold text-[#012B59]">{total.toLocaleString()} FCFA</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onNavigate('proformas')}
            className="border border-gray-300 text-gray-700 rounded-lg py-3 font-medium hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="bg-green-500 text-white rounded-lg py-3 font-medium flex items-center justify-center space-x-2 hover:bg-green-600"
          >
            <Save size={20} />
            <span>Enregistrer</span>
          </button>
        </div>

        <button
          onClick={handleDownloadPDF}
          className="w-full bg-[#012B59] text-white rounded-lg py-3 font-medium flex items-center justify-center space-x-2 hover:bg-[#01203f]"
        >
          <Download size={20} />
          <span>Télécharger PDF</span>
        </button>
      </div>

      {showClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold">Nouveau client</h2>
              <button onClick={() => setShowClientModal(false)} className="text-gray-500">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveClient} className="p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <input
                  type="text"
                  required
                  value={clientForm.name}
                  onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="text"
                  value={clientForm.phone}
                  onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={clientForm.email}
                  onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <textarea
                  value={clientForm.address}
                  onChange={(e) => setClientForm({ ...clientForm, address: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={2}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#012B59] text-white rounded-lg py-2 hover:bg-[#01203f]"
              >
                Ajouter
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
