import React from 'react';

interface PrintButtonProps {
  targetId: string;
}

const PrintIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm7-8V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
);

const PrintButton: React.FC<PrintButtonProps> = ({ targetId }) => {
  const handlePrint = () => {
    const patientName = prompt("Please enter patient name for the report:", "");
    // If user clicks "Cancel" on the prompt, abort printing.
    if (patientName === null) {
        return;
    }

    const printTarget = document.getElementById(targetId);
    if (!printTarget) {
        console.error('Print target not found!');
        return;
    }

    // Create a header element that will only be visible during printing
    const headerEl = document.createElement('div');
    headerEl.id = 'print-patient-header';
    headerEl.className = 'mb-6 pb-4 border-b border-slate-300';
    headerEl.innerHTML = `
        <h2 class="text-2xl font-bold text-slate-800">Obstetrics Companion Report</h2>
        <h3 class="text-lg text-slate-600">Patient: ${patientName || 'N/A'}</h3>
        <h3 class="text-lg text-slate-600">Report Date: ${new Date().toLocaleDateString()}</h3>
    `;

    // Add the header to the top of the printable area
    printTarget.prepend(headerEl);
    
    // Define a cleanup function to run after printing is done
    const afterPrint = () => {
      // Remove the header from the DOM
      headerEl.remove();
      // Remove the event listener to avoid memory leaks
      window.removeEventListener('afterprint', afterPrint);
    };

    // Listen for the afterprint event to clean up
    window.addEventListener('afterprint', afterPrint);

    // Trigger the browser's print dialog
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <PrintIcon />
      Print
    </button>
  );
};

export default PrintButton;