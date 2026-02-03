
import React, { useState, useEffect } from 'react';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { UserPanel } from './pages/UserPanel';
import { AdminPanel } from './pages/AdminPanel';
import { store } from './services/store';

function App() {
  const [currentView, setCurrentView] = useState('landing'); 

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const handleLoginSuccess = () => {
    setCurrentView('user-dashboard');
  };

  const handleAdminLoginSuccess = () => {
    setCurrentView('admin-dashboard');
  };

  const handleLogout = () => {
    store.logout();
    setCurrentView('landing');
  };

  return (
    <div>
      {currentView === 'landing' && <Landing onNavigate={handleNavigate} />}
      
      {(currentView === 'login' || currentView === 'register') && (
        <Auth 
          view={currentView as any} 
          onNavigate={handleNavigate} 
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {currentView === 'user-dashboard' && (
        <UserPanel 
          onLogout={handleLogout} 
          onAdminLogin={() => setCurrentView('admin-dashboard')}
        />
      )}
      
      {currentView === 'admin-dashboard' && <AdminPanel onLogout={() => setCurrentView('user-dashboard')} />}
    </div>
  );
}

export default App;
