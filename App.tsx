
import React, { useState, useEffect } from 'react';
import type { View } from './types';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import GestationCalculator from './components/calculators/GestationCalculator';
import BishopScoreCalculator from './components/calculators/BishopScoreCalculator';
import FetalBiometryCalculator from './components/calculators/FetalBiometryCalculator';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('gestation');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDarkMode);
    if (prefersDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };
  
  const renderContent = () => {
    switch (activeView) {
      case 'gestation':
        return <GestationCalculator />;
      case 'bishop':
        return <BishopScoreCalculator />;
      case 'ultrasound':
        return <FetalBiometryCalculator />;
      default:
        return <GestationCalculator />;
    }
  };

  return (
    <div className="flex h-screen font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeView={activeView} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
