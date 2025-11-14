import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';

export default function Settings() {
  const [settingsId, setSettingsId] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    activity: '',
    phones: '',
    cip: '',
    cip_expiry: '',
    ifu: '',
    email: '',
    rccm: '',
    manager_name: '',
    qr_code_url: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data } = await supabase
      .from('company_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (data) {
      setSettingsId(data.id);
      setFormData({
        name: data.name,
        activity: data.activity,
        phones: data.phones,
        cip: data.cip,
        cip_expiry: data.cip_expiry,
        ifu: data.ifu,
        email: data.email,
        rccm: data.rccm || '',
        manager_name: data.manager_name || '',
        qr_code_url: data.qr_code_url,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (settingsId) {
      await supabase
        .from('company_settings')
        .update(formData)
        .eq('id', settingsId);
    } else {
      await supabase.from('company_settings').insert([formData]);
    }

    alert('Paramètres enregistrés avec succès');
    loadSettings();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Paramètres entreprise" />

      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-lg shadow p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de l'entreprise *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#012B59]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Activité *
              </label>
              <textarea
                required
                value={formData.activity}
                onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#012B59]"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphones *
              </label>
              <input
                type="text"
                required
                value={formData.phones}
                onChange={(e) => setFormData({ ...formData, phones: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#012B59]"
                placeholder="01 96 34 64 35 / 01 94 14 52 69"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  N° CIP *
                </label>
                <input
                  type="text"
                  required
                  value={formData.cip}
                  onChange={(e) => setFormData({ ...formData, cip: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#012B59]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date expiration CIP *
                </label>
                <input
                  type="date"
                  required
                  value={formData.cip_expiry}
                  onChange={(e) => setFormData({ ...formData, cip_expiry: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#012B59]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                N° IFU *
              </label>
              <input
                type="text"
                required
                value={formData.ifu}
                onChange={(e) => setFormData({ ...formData, ifu: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#012B59]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#012B59]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RCCM
              </label>
              <input
                type="text"
                value={formData.rccm}
                onChange={(e) => setFormData({ ...formData, rccm: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#012B59]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du responsable
              </label>
              <input
                type="text"
                value={formData.manager_name}
                onChange={(e) => setFormData({ ...formData, manager_name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#012B59]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                QR Code (URL WhatsApp) *
              </label>
              <input
                type="url"
                required
                value={formData.qr_code_url}
                onChange={(e) => setFormData({ ...formData, qr_code_url: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#012B59]"
                placeholder="https://wa.me/22996346435"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#012B59] text-white rounded-lg py-3 font-medium flex items-center justify-center space-x-2 hover:bg-[#01203f]"
          >
            <Save size={20} />
            <span>Enregistrer les paramètres</span>
          </button>
        </form>
      </div>
    </div>
  );
}
