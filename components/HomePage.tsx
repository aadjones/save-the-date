import React, { useState } from 'react';
import { VENUE_NAME, VENUE_ADDRESS, VENMO_USERNAME } from '../constants';
import { openMapsLink } from '../utils/mapsUtils';
import { useT, LanguageToggleLight } from '../i18n';

const FAIRFIELD_BOOKING_URL = 'https://app.marriott.com/reslink?id=1775002906996&key=GRP&app=resvlink';
const SPRINGHILL_BOOKING_URL = 'https://www.marriott.com/event-reservations/reservation-link.mi?id=1766613917733&key=CORP&app=resvlink';

interface HomePageProps {
  onViewExperience: () => void;
}

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="font-serif italic text-2xl sm:text-3xl text-stone-700 mb-8 pb-3 border-b border-stone-300">
    {children}
  </h2>
);

const BookingButton: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex-1 text-center py-2.5 px-4 border border-stone-800 text-stone-900 font-mono text-xs uppercase tracking-widest hover:bg-stone-900 hover:text-[#dbe9e6] transition-colors"
  >
    {children}
  </a>
);

const PhoneButton: React.FC<{ tel: string; display: string }> = ({ tel, display }) => (
  <a
    href={`tel:${tel}`}
    className="flex-1 text-center py-2.5 px-4 border border-stone-400 text-stone-600 font-mono text-xs uppercase tracking-widest hover:border-stone-800 hover:text-stone-900 transition-colors"
  >
    {display}
  </a>
);

const HomePage: React.FC<HomePageProps> = ({ onViewExperience }) => {
  const t = useT();
  const h = t.home;
  const [showVenmoQR, setShowVenmoQR] = useState(false);

  const sections = [
    { id: 'hotels', label: h.navHotels },
    { id: 'directions', label: h.navDirections },
    { id: 'attire', label: h.navAttire },
    { id: 'rsvp', label: h.navRsvp },
    { id: 'gifts', label: h.navGifts },
  ];

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="h-dvh overflow-y-auto bg-[#dbe9e6] text-stone-900">

      {/* Hero */}
      <section className="relative pt-4 pb-20 px-6 text-center">
        <div className="flex justify-end mb-6">
          <LanguageToggleLight />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone-600 mb-8">
          {h.invited}
        </p>
        <h1 className="font-serif italic text-4xl sm:text-6xl text-stone-900 tracking-wide mb-6">
          {h.heroTitle}
        </h1>
        <div className="flex justify-center mb-6">
          <img
            src="/potatoes-transparent.png"
            alt="Aaron & Anakaren"
            className="h-48 sm:h-64 w-auto object-contain"
          />
        </div>
        <p className="font-mono text-sm sm:text-base text-stone-700 tracking-widest mb-1">
          {t.app.date}
        </p>
        <p className="font-mono text-xs sm:text-sm text-stone-600 tracking-widest mb-3">
          {h.time}
        </p>
        <p className="font-serif italic text-stone-600 text-lg sm:text-xl mb-5">
          {VENUE_NAME}
        </p>
        <p className="font-mono text-[10px] sm:text-xs text-stone-600 tracking-wider">
          {VENUE_ADDRESS}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone-600 mt-6">
          {h.attire}
        </p>
      </section>

      {/* Sticky anchor strip */}
      <nav className="sticky top-0 z-40 bg-[#dbe9e6]/90 backdrop-blur-sm border-b border-stone-300/60">
        <div className="flex justify-center gap-6 sm:gap-10 py-3 px-4">
          {sections.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-stone-600 hover:text-stone-900 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-6 py-16 flex flex-col gap-20">

        {/* Hotels */}
        <section id="hotels">
          <SectionHeader>{h.sectionAccommodation}</SectionHeader>
          <div className="flex flex-col gap-6">

            {/* Fairfield */}
            <div className="bg-white/40 border border-stone-300 p-6">
              <h3 className="font-serif font-bold text-xl text-stone-900 mb-1">
                Fairfield by Marriott Inn & Suites
              </h3>
              <p className="font-mono text-[10px] text-stone-700 uppercase tracking-widest mb-5">
                {h.fairfieldLocation}
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-baseline">
                  <span className="font-serif text-stone-600 text-sm">{h.groupRate}</span>
                  <span className="font-mono text-stone-900 font-bold">~$180 / night</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="font-serif text-stone-600 text-sm">{h.groupCode}</span>
                  <span className="font-mono text-stone-900 font-bold tracking-widest">WSJ</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="font-serif text-stone-600 text-sm">{h.bookBy}</span>
                  <span className="font-mono text-amber-800 text-sm font-semibold">{h.fairfieldDeadline}</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <BookingButton href={FAIRFIELD_BOOKING_URL}>{h.bookOnline}</BookingButton>
                  <PhoneButton tel="+17608910111" display="(760) 891-0111" />
                </div>
                <p className="font-serif italic text-xs text-stone-600 mt-1">
                  {h.fairfieldNote}
                </p>
              </div>
            </div>

            {/* SpringHill */}
            <div className="bg-white/40 border border-stone-300 p-6">
              <h3 className="font-serif font-bold text-xl text-stone-900 mb-1">
                SpringHill Suites by Marriott
              </h3>
              <p className="font-mono text-[10px] text-stone-700 uppercase tracking-widest mb-5">
                {h.springhillLocation}
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-baseline">
                  <span className="font-serif text-stone-600 text-sm">{h.rate}</span>
                  <span className="font-mono text-stone-900 font-bold">~$214 / night</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <BookingButton href={SPRINGHILL_BOOKING_URL}>{h.bookOnline}</BookingButton>
                  <PhoneButton tel="+14422868100" display="(442) 286-8100" />
                </div>
                <div className="flex flex-col gap-1.5 mt-1">
                  <p className="font-serif italic text-xs text-stone-600">{h.springhillNote1}</p>
                  <p className="font-serif italic text-xs text-stone-600">{h.springhillNote2}</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Directions */}
        <section id="directions">
          <SectionHeader>{h.sectionDirections}</SectionHeader>
          <div className="flex flex-col gap-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-stone-600 mb-2">{h.addressLabel}</p>
              <p className="font-serif text-stone-900 text-lg">{VENUE_ADDRESS}</p>
            </div>
            <p className="font-serif italic text-stone-600 leading-relaxed">{h.directionsText}</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-stone-600">{h.appleMapsNote}</p>
            <button
              onClick={() => openMapsLink(`${VENUE_NAME}, ${VENUE_ADDRESS}`)}
              className="self-start py-2.5 px-6 border border-stone-800 text-stone-900 font-mono text-xs uppercase tracking-widest hover:bg-stone-900 hover:text-[#dbe9e6] transition-colors"
            >
              {h.openInMaps}
            </button>
          </div>
        </section>

        {/* Attire */}
        <section id="attire">
          <SectionHeader>{h.sectionAttire}</SectionHeader>
          <div className="flex flex-col gap-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-stone-600">{h.attire}</p>
            <p className="font-serif italic text-stone-600 leading-relaxed">{h.attireNote}</p>
          </div>
        </section>

        {/* RSVP */}
        <section id="rsvp">
          <SectionHeader>{h.sectionRsvp}</SectionHeader>
          <div className="flex flex-col gap-5">
            <p className="font-serif italic text-stone-600 leading-relaxed">{h.rsvpText}</p>
          </div>
        </section>

        {/* Gifts */}
        <section id="gifts">
          <SectionHeader>{h.sectionGifts}</SectionHeader>
          <div className="flex flex-col gap-6">
            <p className="font-serif italic text-stone-600 text-lg leading-relaxed">{h.giftsText}</p>
            
            <div className="bg-white/40 border border-stone-300 p-6 flex flex-col items-center text-center gap-4">
              <h3 className="font-serif font-bold text-xl text-stone-900">
                {h.honeymoonFundTitle}
              </h3>
              <p className="font-serif italic text-stone-600 text-sm leading-relaxed max-w-md">
                {h.honeymoonFundDesc}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full max-w-md">
                <a
                  href={`https://venmo.com/u/${VENMO_USERNAME}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-2.5 px-4 bg-stone-900 text-[#dbe9e6] font-mono text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors"
                >
                  {h.venmoButton}
                </a>
                <button
                  onClick={() => setShowVenmoQR(true)}
                  className="flex-1 text-center py-2.5 px-4 border border-stone-800 text-stone-900 font-mono text-xs uppercase tracking-widest hover:bg-stone-900 hover:text-[#dbe9e6] transition-colors cursor-pointer"
                >
                  {h.qrButton}
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-stone-300 py-16 px-6 text-center">
        <p className="font-serif italic text-stone-600 mb-4 text-sm">{h.footerTeaser}</p>
        <button
          onClick={onViewExperience}
          className="font-mono text-xs uppercase tracking-widest text-stone-600 hover:text-stone-900 transition-colors underline decoration-dotted underline-offset-4 cursor-pointer"
        >
          {h.footerLink}
        </button>
      </footer>

      {/* Venmo QR Modal */}
      {showVenmoQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#dbe9e6] border border-stone-300 max-w-sm w-full p-8 flex flex-col items-center gap-6 shadow-xl relative animate-scale-up">
            <button
              onClick={() => setShowVenmoQR(false)}
              className="absolute top-4 right-4 text-stone-600 hover:text-stone-950 font-mono text-sm cursor-pointer"
              aria-label={h.qrClose}
            >
              ✕
            </button>
            <h3 className="font-serif italic text-2xl text-stone-900">
              {h.honeymoonFundTitle}
            </h3>
            
            <div className="bg-white p-4 border border-stone-300 shadow-inner flex items-center justify-center w-64 h-64">
              <img
                src="/venmo-qr.png"
                alt="Venmo QR Code"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = document.getElementById('qr-fallback');
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div
                id="qr-fallback"
                style={{ display: 'none' }}
                className="flex-col items-center justify-center text-center gap-3 text-stone-400 p-4"
              >
                <svg className="w-12 h-12 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 15h.008v.008H15V15zm0 2.25h.008v.008H15v-.008zM17.25 15h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm-2.25 2.25h.008v.008H15v-.008zm2.25 0h.008v.008h-.008v-.008zm2.25-2.25h.008v.008H19.5V15zm0 2.25h.008v.008H19.5v-.008zm0 2.25h.008v.008H19.5v-.008z" />
                </svg>
                <p className="font-mono text-[9px] uppercase tracking-wider">
                  Drop venmo-qr.png into public/ folder
                </p>
              </div>
            </div>

            <p className="font-mono text-xs text-stone-600 uppercase tracking-widest text-center">
              @{VENMO_USERNAME}
            </p>
            <button
              onClick={() => setShowVenmoQR(false)}
              className="py-2 px-6 bg-stone-900 text-[#dbe9e6] font-mono text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors w-full cursor-pointer"
            >
              {h.qrClose}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default HomePage;
