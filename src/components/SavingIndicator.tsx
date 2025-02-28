// src/components/Dashboard/SavingIndicator.tsx
import React from "react";

interface SavingIndicatorProps {
  isSaving: boolean;
}

const SavingIndicator: React.FC<SavingIndicatorProps> = ({ isSaving }) => {
  if (!isSaving) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-blue-100 border border-blue-300 text-blue-800 px-3 py-2 rounded-lg shadow-md z-40 flex items-center space-x-2 pointer-events-none">
      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-sm font-medium">Saving changes...</span>
    </div>
  );
};

export default SavingIndicator;
