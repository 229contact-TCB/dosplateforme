import { useEffect, useState } from 'react';
import { Users, FileText, DollarSign, Plus, Eye, History, UserPlus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';

interface DashboardProps {
  onNavigate: (page: string, data?: unknown) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [stats, setStats] = useState({
    clientCount: 0,
    proformaCount: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [clientsResult, proformasResult] = await Promise.all([
      supabase.from('clients').select('id', { count: 'exact', head: true }),
      supabase.from('proformas').select('total'),
    ]);

    const clientCount = clientsResult.count || 0;
    const proformas = proformasResult.data || [];
    const totalAmount = proformas.reduce((sum, p) => sum + Number(p.total), 0);

    setStats({
      clientCount,
      proformaCount: proformas.length,
      totalAmount,
    });
  };

  const statCards = [
    {
      title: 'Nombre de clients',
      value: stats.clientCount,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Nombre de proformas',
      value: stats.proformaCount,
      icon: FileText,
      color: 'bg-green-500',
    },
    {
      title: 'Montant total estimé',
      value: `${stats.totalAmount.toLocaleString()} FCFA`,
      icon: DollarSign,
      color: 'bg-purple-500',
    },
  ];

  const actionButtons = [
    {
      label: 'Voir clients',
      icon: Eye,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => onNavigate('clients'),
    },
    {
      label: 'Nouvelle facture',
      icon: Plus,
      color: 'bg-red-500 hover:bg-red-600',
      action: () => onNavigate('new-proforma'),
    },
    {
      label: 'Historique des factures',
      icon: History,
      color: 'bg-yellow-500 hover:bg-yellow-600',
      action: () => onNavigate('proformas'),
    },
    {
      label: 'Ajouter un client',
      icon: UserPlus,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => onNavigate('clients', { openModal: true }),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Tableau de bord" />

      <div className="p-4 space-y-6">
        <div className="grid grid-cols-1 gap-4">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 flex items-center"
              >
                <div className={`${card.color} p-4 rounded-lg mr-4`}>
                  <Icon className="text-white" size={32} />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-2 gap-4">
            {actionButtons.map((button, index) => {
              const Icon = button.icon;
              return (
                <button
                  key={index}
                  onClick={button.action}
                  className={`${button.color} text-white rounded-lg p-6 flex flex-col items-center justify-center space-y-2 transition-colors`}
                >
                  <Icon size={32} />
                  <span className="text-sm font-medium text-center">{button.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
