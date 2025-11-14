import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { supabase, Client } from '../lib/supabase';
import Header from '../components/Header';

interface ClientsProps {
  initialData?: { openModal: boolean };
}

export default function Clients({ initialData }: ClientsProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [showModal, setShowModal] = useState(initialData?.openModal || false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    const { data } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setClients(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingClient) {
      await supabase
        .from('clients')
        .update(formData)
        .eq('id', editingClient.id);
    } else {
      await supabase.from('clients').insert([formData]);
    }

    setFormData({ name: '', phone: '', email: '', address: '' });
    setEditingClient(null);
    setShowModal(false);
    loadClients();
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      phone: client.phone,
      email: client.email,
      address: client.address,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      await supabase.from('clients').delete().eq('id', id);
      loadClients();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingClient(null);
    setFormData({ name: '', phone: '', email: '', address: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Gestion des clients" />

      <div className="p-4">
        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-[#012B59] text-white rounded-lg py-3 px-4 flex items-center justify-center space-x-2 mb-4 hover:bg-[#01203f]"
        >
          <Plus size={20} />
          <span>Ajouter un client</span>
        </button>

        <div className="space-y-3">
          {clients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-lg shadow p-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{client.name}</h3>
                  {client.phone && (
                    <p className="text-sm text-gray-600">Tél: {client.phone}</p>
                  )}
                  {client.email && (
                    <p className="text-sm text-gray-600">Email: {client.email}</p>
                  )}
                  {client.address && (
                    <p className="text-sm text-gray-600">Adresse: {client.address}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(client)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {clients.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Aucun client enregistré
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold">
                {editingClient ? 'Modifier le client' : 'Nouveau client'}
              </h2>
              <button onClick={closeModal} className="text-gray-500">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom ou Entreprise *
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
                  Téléphone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#012B59]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#012B59]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#012B59]"
                  rows={3}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#012B59] text-white rounded-lg py-2 hover:bg-[#01203f]"
                >
                  {editingClient ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
