import React, { ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
}

/**
 * Simple tooltip component for hover interactions
 * Shows on desktop hover, hidden on mobile to keep UI clean
 */
const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  return (
    <div className="relative group">
      {children}

      {/* Tooltip content - hidden on mobile (touch devices), visible on desktop hover */}
      <div className="hidden sm:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-stone-800 text-stone-200 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-stone-700">
        {content}

        {/* Arrow pointing down */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
          <div className="border-4 border-transparent border-t-stone-800" />
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
