import { Home, Users, FileText, Settings } from 'lucide-react';

interface MobileNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function MobileNav({ currentPage, onNavigate }: MobileNavProps) {
  const navItems = [
    { id: 'dashboard', label: 'Accueil', icon: Home },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'proformas', label: 'Factures', icon: FileText },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full ${
                isActive ? 'text-[#012B59]' : 'text-gray-500'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
