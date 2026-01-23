/**
 * Centralized Design System
 *
 * This file contains all design tokens, reusable class strings, and style constants
 * to ensure consistency across all modules and make refactoring easier.
 */

// ============================================================================
// COLORS
// ============================================================================

export const colors = {
  // Background
  background: {
    primary: 'bg-stone-950',
    overlay: 'bg-stone-950/60',
    button: 'bg-stone-900/80',
    buttonHover: 'bg-stone-800/80',
  },

  // Text
  text: {
    primary: 'text-stone-100',
    secondary: 'text-stone-200',
    tertiary: 'text-stone-400',
    muted: 'text-stone-500',
    subtle: 'text-stone-600',
    label: 'text-stone-500',
    caption: 'text-stone-600',
  },

  // Borders
  border: {
    primary: 'border-stone-800',
    secondary: 'border-stone-700',
    subtle: 'border-stone-800/30',
  },

  // Accents
  accent: {
    amber: 'text-amber-500',
    amberBright: 'text-amber-100',
    sky: 'text-sky-400',
  },

  // State colors
  state: {
    active: 'bg-stone-100 text-stone-900 border-stone-100',
    inactive: 'bg-transparent text-stone-500 border-stone-800',
    hover: 'hover:border-stone-600',
  }
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
  // Headers
  header: {
    module: 'text-xl sm:text-3xl italic font-serif text-stone-400',
  },

  // Numbers (countdown displays)
  number: {
    large: 'text-6xl sm:text-8xl font-mono font-bold text-stone-100 tabular-nums tracking-tight',
    medium: 'text-4xl sm:text-6xl md:text-8xl font-mono font-light tracking-[-0.05em] tabular-nums text-stone-100',
    small: 'text-2xl sm:text-4xl font-mono text-stone-200 tabular-nums',
  },

  // Labels
  label: {
    uppercase: 'text-xs sm:text-sm uppercase tracking-widest text-stone-500 font-semibold',
    small: 'text-[10px] sm:text-xs uppercase tracking-widest text-stone-500',
    mono: 'font-mono text-[10px] sm:text-xs uppercase tracking-widest',
  },

  // Captions (footer text)
  caption: {
    standard: 'text-stone-600 font-mono text-[10px] sm:text-xs',
    italic: 'text-stone-600 font-serif italic text-sm sm:text-base',
  },

  // Interactive hints
  hint: {
    standard: 'text-stone-600 font-serif italic text-sm sm:text-base',
    animated: 'text-stone-700 font-mono text-[10px] sm:text-xs uppercase tracking-widest animate-pulse',
  }
} as const;

// ============================================================================
// SPACING & LAYOUT
// ============================================================================

export const spacing = {
  // Standard padding for modules
  module: 'p-6',

  // Header positioning (consistent across all modules)
  header: {
    top: 'top-16 sm:top-12',
    position: 'absolute left-0 right-0 z-10 text-center pointer-events-none px-4',
  },

  // Footer/caption positioning
  footer: {
    bottom: 'bottom-12',
    position: 'absolute left-0 right-0 text-center px-4 z-10',
  },

  // Common gaps
  gap: {
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-8',
  }
} as const;

// ============================================================================
// COMPONENTS
// ============================================================================

export const components = {
  // Module header (consistent across all modules)
  moduleHeader: `${spacing.header.position} ${spacing.header.top}`,

  // Module footer caption
  moduleFooter: `${spacing.footer.position} ${spacing.footer.bottom} ${typography.caption.standard}`,

  // Button base
  button: {
    base: 'transition-all duration-300 rounded-full border',
    primary: `${colors.state.active}`,
    secondary: `${colors.state.inactive} ${colors.state.hover}`,
    focus: 'focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 focus:ring-offset-stone-950',
  },

  // Pagination dots
  pagination: {
    container: 'absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-40 pointer-events-none opacity-70',
    dot: 'w-1.5 h-1.5 rounded-full transition-all duration-300',
    dotActive: 'bg-stone-300 scale-125',
    dotInactive: 'bg-stone-600',
  },

  // Shuffle button
  shuffle: {
    container: 'fixed bottom-6 right-6 z-50',
    button: `p-3 ${colors.background.button} backdrop-blur-sm rounded-full text-stone-500 hover:text-stone-300 ${colors.background.buttonHover} transition-all border ${colors.border.subtle}`,
  }
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Combines class strings, useful for building component styles
 */
export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Gets the complete module header className
 */
export function getModuleHeaderClass(): string {
  return `${components.moduleHeader} ${typography.header.module}`;
}

/**
 * Gets the complete module footer className
 */
export function getModuleFooterClass(): string {
  return components.moduleFooter;
}

/**
 * Gets button classes based on state
 */
export function getButtonClass(isActive: boolean): string {
  return cn(
    components.button.base,
    isActive ? components.button.primary : components.button.secondary,
    components.button.focus
  );
}

// ============================================================================
// ANIMATION
// ============================================================================

export const animation = {
  transition: {
    fast: 'transition-all duration-150',
    standard: 'transition-all duration-300',
    slow: 'transition-all duration-500',
  },

  fadeIn: 'animate-in fade-in duration-500',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
} as const;

// ============================================================================
// EFFECTS
// ============================================================================

export const effects = {
  backdrop: 'backdrop-blur-sm',
  shadow: {
    subtle: 'shadow-sm',
    standard: 'shadow-lg',
    heavy: 'shadow-2xl',
  },
  blur: {
    small: 'blur-[100px]',
    medium: 'blur-[120px]',
  }
} as const;
