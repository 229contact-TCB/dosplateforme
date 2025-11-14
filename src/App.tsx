import { useState } from 'react';
import MobileNav from './components/MobileNav';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Articles from './pages/Articles';
import NewProforma from './pages/NewProforma';
import Proformas from './pages/Proformas';
import Settings from './pages/Settings';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [pageData, setPageData] = useState<unknown>(null);

  const handleNavigate = (page: string, data?: unknown) => {
    setCurrentPage(page);
    setPageData(data || null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'clients':
        return <Clients initialData={pageData as { openModal: boolean }} />;
      case 'articles':
        return <Articles />;
      case 'new-proforma':
        return <NewProforma
          editingProforma={pageData as { id: string; invoice_number: string; client_id: string; client_name: string; date: string; tax_rate: number; payment_terms: string }}
          onNavigate={handleNavigate}
        />;
      case 'proformas':
        return <Proformas onNavigate={handleNavigate} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderPage()}
      <MobileNav currentPage={currentPage} onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
