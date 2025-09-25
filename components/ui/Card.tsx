import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, actions, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-slate-800 shadow-lg rounded-xl overflow-hidden ${className} print-card`}>
      <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center print-card-header">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white print-text-reset">{title}</h2>
        {actions && <div className="print-button-wrapper">{actions}</div>}
      </div>
      <div className="p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;