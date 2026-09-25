/**
 * Centralized Design System
 *
 * Per-module "vibes" (palette + fonts), plus the few class strings shared across modules.
 */

export const components = {
  // Pagination dots
  pagination: {
    container: 'absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-40 pointer-events-none opacity-70',
    dot: 'w-1.5 h-1.5 rounded-full transition-all duration-300',
    dotActive: 'bg-stone-300 scale-125',
    dotInactive: 'bg-stone-600',
  },
} as const;

/**
 * Gets pill-button classes based on state
 */
export function getButtonClass(isActive: boolean): string {
  const base = 'transition-all duration-300 rounded-full border focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 focus:ring-offset-stone-950';
  const state = isActive
    ? 'bg-blue-600 text-white border-blue-600'
    : 'bg-transparent text-slate-500 border-slate-400 hover:border-slate-600 hover:text-slate-700';
  return `${base} ${state}`;
}

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
  branding: string;
}> = {
  wedding: {
    container: 'bg-[#dbe9e6] text-stone-900', // Deeper sage for better blending
    header: 'font-serif italic text-stone-600 tracking-wide',
    number: 'font-serif font-light text-stone-900',
    label: 'font-serif uppercase tracking-widest text-stone-500',
    footer: 'font-serif italic text-stone-400',
    branding: 'text-stone-800'
  },
  space: {
    container: 'bg-black text-white',
    header: 'font-mono uppercase text-white tracking-widest',
    number: 'font-mono font-bold text-white tracking-tighter',
    label: 'font-mono uppercase text-sky-400',
    footer: 'font-mono text-stone-500',
    branding: 'text-stone-100'
  },
  elemental: {
    container: 'bg-[#1a2f2a] text-stone-100', // deep forest green
    header: 'font-serif italic text-emerald-200 tracking-normal',
    number: 'font-serif font-medium text-white',
    label: 'font-sans uppercase tracking-[0.2em] text-emerald-400',
    footer: 'font-serif italic text-stone-400',
    branding: 'text-emerald-100'
  },
  mystical: {
    container: 'bg-[#120b1e] text-indigo-100', // deep mystical violet
    header: 'font-serif lowercase tracking-widest text-indigo-300',
    number: 'font-serif font-bold text-white drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]',
    label: 'font-serif uppercase tracking-[0.3em] text-violet-400',
    footer: 'font-serif italic text-indigo-500',
    branding: 'text-indigo-200'
  },
  corporate: {
    container: 'bg-[#f1f5f9] text-slate-900', // Soft professional off-white
    header: 'font-sans font-black uppercase text-slate-500 tracking-tight',
    number: 'font-sans font-bold text-slate-900',
    label: 'font-sans font-bold uppercase text-blue-600',
    footer: 'font-sans font-medium text-slate-400',
    branding: 'text-slate-800'
  },
  humorous: {
    container: 'bg-yellow-400 text-black',
    header: 'font-mono font-black italic text-black -rotate-2',
    number: 'font-mono font-black text-black scale-y-125',
    label: 'font-mono font-bold uppercase text-pink-600',
    footer: 'font-mono font-bold text-black opacity-60',
    branding: 'text-black'
  },
  steampunk: {
    container: 'bg-[#150d08] text-[#e5c100]', // Darker espresso over gold
    header: 'font-serif font-black uppercase text-[#eab308] tracking-widest border-y-2 border-[#eab308]/30 py-1',
    number: 'font-serif font-bold text-[#fcd34d]',
    label: 'font-serif uppercase font-black text-[#d97706] tracking-tighter', // Amber-600
    footer: 'font-serif italic text-stone-500 opacity-60',
    branding: 'text-[#d4af37]'
  }
};

/**
 * Helper to get vibe-specific class for a module element
 */
export function getVibeClass(vibe: Vibe, element: keyof typeof vibes[Vibe]): string {
  return vibes[vibe][element];
}
