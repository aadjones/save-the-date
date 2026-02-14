import React from 'react';
import { Shuffle } from 'lucide-react';
import { components } from '../designSystem';
import { useT } from '../i18n';

interface Props {
  onClick: () => void;
}

const ShuffleButton: React.FC<Props> = ({ onClick }) => {
  const t = useT();
  return (
    <button
      onClick={onClick}
      className={`${components.shuffle.container} ${components.shuffle.button} ${components.button.focus}`}
      aria-label={t.app.shuffleAriaLabel}
    >
      <Shuffle size={18} strokeWidth={1.5} />
    </button>
  );
};

export default ShuffleButton;
