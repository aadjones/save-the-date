import React from 'react';
import { Shuffle } from 'lucide-react';
import { components } from '../designSystem';

interface Props {
  onClick: () => void;
}

const ShuffleButton: React.FC<Props> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`${components.shuffle.container} ${components.shuffle.button} ${components.button.focus}`}
      aria-label="Random Clock"
    >
      <Shuffle size={18} strokeWidth={1.5} />
    </button>
  );
};

export default ShuffleButton;
