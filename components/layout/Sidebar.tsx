import React from 'react';
import type { View } from '../../types';
import { NAVIGATION_ITEMS } from '../../constants';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const StethoscopeIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2v-2.945M15 11V5.5A2.5 2.5 0 0012.5 3h-1A2.5 2.5 0 009 5.5V11m-7 8h18" />
    </svg>
);

const NavIcon: React.FC<{ view: View }> = ({ view }) => {
    const baseClass = "h-6 w-6 lg:mr-3";
    switch(view) {
        case 'gestation': return <svg xmlns="http://www.w3.org/2000/svg" className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
        case 'bishop': return <svg xmlns="http://www.w3.org/2000/svg" className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
        case 'ultrasound': return <svg xmlns="http://www.w3.org/2000/svg" className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
        default: return null;
    }
};


const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <aside className="w-16 lg:w-64 bg-white dark:bg-slate-800 flex-shrink-0 transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-center h-20 border-b border-slate-200 dark:border-slate-700">
        <StethoscopeIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        <h1 className="ml-2 text-xl font-bold text-slate-800 dark:text-white hidden lg:block">OB Companion</h1>
      </div>
      <nav className="mt-4">
        <ul>
          {NAVIGATION_ITEMS.map((item) => (
            <li key={item.id} className="px-2 py-1">
              <button
                onClick={() => setActiveView(item.id as View)}
                className={`w-full flex items-center px-4 py-2 text-left rounded-lg transition-colors duration-200 justify-center lg:justify-start ${
                  activeView === item.id
                    ? 'bg-blue-100 dark:bg-slate-700 text-blue-700 dark:text-blue-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                }`}
              >
                <NavIcon view={item.id as View} />
                <span className="hidden lg:inline-block">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;