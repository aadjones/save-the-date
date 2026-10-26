import React from 'react';

const NEW_HOME = 'https://www.studiodemby.com/extras/married-for';

// The countdown moved to Studio Demby; every old link (including /#experience) lands here
const App: React.FC = () => (
  <div className="moved-page min-h-dvh w-full bg-[#dbe9e6] text-stone-900 flex flex-col items-center justify-center gap-8 px-4 py-12">
    <a href={NEW_HOME} className="moved-art block w-full max-w-xs sm:max-w-sm transition-transform hover:scale-[1.02]">
      <img src="/potatoes-transparent.png" alt="Aaron & Anakaren: go to the new home" className="w-full h-auto" />
    </a>

    <div className="moved-message flex flex-col items-center gap-6 text-center">
      <div>
        <h1 className="moved-headline font-serif italic font-bold text-stone-600 text-2xl sm:text-3xl tracking-wide">We've moved.</h1>
        <p className="moved-subline font-serif text-stone-500 text-base sm:text-lg mt-2">The clock is still counting at its new home!</p>
      </div>
      <div lang="es">
        <h1 className="moved-headline font-serif italic font-bold text-stone-600 text-2xl sm:text-3xl tracking-wide">Nos mudamos.</h1>
        <p className="moved-subline font-serif text-stone-500 text-base sm:text-lg mt-2">¡El reloj sigue contando en su nuevo hogar!</p>
      </div>
    </div>

    <a
      href={NEW_HOME}
      className="moved-link font-mono text-[11px] sm:text-xs text-stone-700 border border-stone-400 rounded-full px-4 py-2 hover:bg-stone-900 hover:text-stone-100 hover:border-stone-900 transition-colors"
    >
      studiodemby.com/extras/married-for →
    </a>
  </div>
);

export default App;
