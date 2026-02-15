/**
 * Centralized Design System
 *
 * This file contains all design tokens, reusable class strings, and style constants
 * to ensure consistency across all modules and make refactoring easier.
 */

import { cn } from './utils/cn';

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
    active: 'bg-blue-600 text-white border-blue-600',
    inactive: 'bg-transparent text-slate-500 border-slate-400',
    hover: 'hover:border-slate-600 hover:text-slate-700',
  }
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
  // Headers
  header: {
    module: 'text-xl sm:text-2xl md:text-3xl italic font-serif text-stone-400',
  },

  // Numbers (countdown displays)
  number: {
    large: 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-mono font-bold text-stone-100 tabular-nums tracking-tight',
    medium: 'text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-mono font-light tracking-[-0.05em] tabular-nums text-stone-100',
    small: 'text-xl sm:text-3xl md:text-4xl font-mono text-stone-200 tabular-nums',
  },

  // Labels
  label: {
    uppercase: 'text-xs sm:text-sm md:text-base uppercase tracking-widest text-stone-500 font-semibold',
    small: 'text-[10px] sm:text-xs md:text-sm uppercase tracking-widest text-stone-500',
    mono: 'font-mono text-[10px] sm:text-xs md:text-sm uppercase tracking-widest',
  },

  // Captions (footer text)
  caption: {
    standard: 'text-stone-600 font-mono text-[10px] sm:text-xs md:text-sm',
    italic: 'text-stone-600 font-serif italic text-sm sm:text-base md:text-lg',
  },

  // Interactive hints
  hint: {
    standard: 'text-stone-600 font-serif italic text-sm sm:text-base md:text-lg',
    animated: 'text-stone-700 font-mono text-[10px] sm:text-xs md:text-sm uppercase tracking-widest animate-pulse',
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
    top: 'top-20 sm:top-12',
    position: 'absolute left-0 right-0 z-10 text-center pointer-events-none px-4',
  },

  // Footer/caption positioning
  footer: {
    bottom: 'bottom-20 sm:bottom-12',
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

} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

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
    vibrant: 'shadow-[0_0_20px_rgba(255,105,180,0.5)]', // used for absurd vibe
  },
  blur: {
    small: 'blur-[100px]',
    medium: 'blur-[120px]',
  }
} as const;

// ============================================================================
// VIBES (Module Specific Design Themes)
// ============================================================================

export type Vibe = 'wedding' | 'space' | 'elemental' | 'mystical' | 'corporate' | 'humorous' | 'steampunk';

export const vibes: Record<Vibe, {
  container: string;
  header: string;
  number: string;
  label: string;
  footer: string;
  accent?: string;
  branding: string;
  pagination: {
    active: string;
    inactive: string;
  };
}> = {
  wedding: {
    container: 'bg-[#dbe9e6] text-stone-900', // Deeper sage for better blending
    header: 'font-serif italic text-stone-600 tracking-wide',
    number: 'font-serif font-light text-stone-900',
    label: 'font-serif uppercase tracking-widest text-stone-500',
    footer: 'font-serif italic text-stone-400',
    accent: 'text-teal-600',
    branding: 'text-stone-800',
    pagination: { active: 'bg-stone-800', inactive: 'bg-stone-300' }
  },
  space: {
    container: 'bg-black text-white',
    header: 'font-mono uppercase text-white tracking-widest',
    number: 'font-mono font-bold text-white tracking-tighter',
    label: 'font-mono uppercase text-sky-400',
    footer: 'font-mono text-stone-500',
    accent: 'text-sky-500',
    branding: 'text-stone-100',
    pagination: { active: 'bg-sky-400', inactive: 'bg-stone-700' }
  },
  elemental: {
    container: 'bg-[#1a2f2a] text-stone-100', // deep forest green
    header: 'font-serif italic text-emerald-200 tracking-normal',
    number: 'font-serif font-medium text-white',
    label: 'font-sans uppercase tracking-[0.2em] text-emerald-400',
    footer: 'font-serif italic text-stone-400',
    branding: 'text-emerald-100',
    pagination: { active: 'bg-emerald-400', inactive: 'bg-[#0f1b18]' }
  },
  mystical: {
    container: 'bg-[#120b1e] text-indigo-100', // deep mystical violet
    header: 'font-serif lowercase tracking-widest text-indigo-300',
    number: 'font-serif font-bold text-white drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]',
    label: 'font-serif uppercase tracking-[0.3em] text-violet-400',
    footer: 'font-serif italic text-indigo-500',
    branding: 'text-indigo-200',
    pagination: { active: 'bg-violet-400', inactive: 'bg-[#0a0512]' }
  },
  corporate: {
    container: 'bg-[#f1f5f9] text-slate-900', // Soft professional off-white
    header: 'font-sans font-black uppercase text-slate-500 tracking-tight',
    number: 'font-sans font-bold text-slate-900',
    label: 'font-sans font-bold uppercase text-blue-600',
    footer: 'font-sans font-medium text-slate-400',
    branding: 'text-slate-800',
    pagination: { active: 'bg-blue-600', inactive: 'bg-slate-300' }
  },
  humorous: {
    container: 'bg-yellow-400 text-black',
    header: 'font-mono font-black italic text-black -rotate-2',
    number: 'font-mono font-black text-black scale-y-125',
    label: 'font-mono font-bold uppercase text-pink-600',
    footer: 'font-mono font-bold text-black opacity-60',
    branding: 'text-black',
    pagination: { active: 'bg-black', inactive: 'bg-yellow-600/40' }
  },
  steampunk: {
    container: 'bg-[#150d08] text-[#e5c100]', // Darker espresso over gold
    header: 'font-serif font-black uppercase text-[#eab308] tracking-widest border-y-2 border-[#eab308]/30 py-1',
    number: 'font-serif font-bold text-[#fcd34d]',
    label: 'font-serif uppercase font-black text-[#d97706] tracking-tighter', // Amber-600
    footer: 'font-serif italic text-stone-500 opacity-60',
    branding: 'text-[#d4af37]',
    pagination: { active: 'bg-[#fcd34d]', inactive: 'bg-[#4a3728]' }
  }
};

/**
 * Helper to get vibe-specific class for a module element
 */
export function getVibeClass(vibe: Vibe, element: Exclude<keyof typeof vibes[Vibe], 'pagination'>): string {
  return (vibes[vibe][element] as string) || '';
}
