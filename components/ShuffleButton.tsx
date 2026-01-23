import React from 'react';
import { Shuffle } from 'lucide-react';

interface Props {
  onClick: () => void;
}

const ShuffleButton: React.FC<Props> = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 p-4 bg-stone-800 rounded-full text-stone-400 hover:bg-stone-700 hover:text-stone-200 transition-all shadow-2xl border border-stone-700"
      aria-label="Random Clock"
    >
      <Shuffle size={20} />
    </button>
  );
};

export default ShuffleButton;
