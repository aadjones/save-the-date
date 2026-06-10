import React from 'react';
import { VENUE_NAME, VENUE_ADDRESS } from '../constants';
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

  const sections = [
    { id: 'hotels', label: h.navHotels },
    { id: 'directions', label: h.navDirections },
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
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone-400 mb-8">
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
        <p className="font-mono text-sm sm:text-base text-stone-500 tracking-widest mb-1">
          {t.app.date}
        </p>
        <p className="font-mono text-xs sm:text-sm text-stone-400 tracking-widest mb-3">
          {h.time}
        </p>
        <p className="font-serif italic text-stone-600 text-lg sm:text-xl mb-5">
          {VENUE_NAME}
        </p>
        <p className="font-mono text-[10px] sm:text-xs text-stone-400 tracking-wider">
          {VENUE_ADDRESS}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone-400 mt-6">
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
              className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors"
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
              <p className="font-mono text-[10px] text-stone-500 uppercase tracking-widest mb-5">
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
                  <span className="font-mono text-amber-700 text-sm font-semibold">{h.fairfieldDeadline}</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <BookingButton href={FAIRFIELD_BOOKING_URL}>{h.bookOnline}</BookingButton>
                  <PhoneButton tel="+17608910111" display="(760) 891-0111" />
                </div>
                <p className="font-serif italic text-xs text-stone-400 mt-1">
                  {h.fairfieldNote}
                </p>
              </div>
            </div>

            {/* SpringHill */}
            <div className="bg-white/40 border border-stone-300 p-6">
              <h3 className="font-serif font-bold text-xl text-stone-900 mb-1">
                SpringHill Suites by Marriott
              </h3>
              <p className="font-mono text-[10px] text-stone-500 uppercase tracking-widest mb-5">
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
                  <p className="font-serif italic text-xs text-stone-400">{h.springhillNote1}</p>
                  <p className="font-serif italic text-xs text-stone-400">{h.springhillNote2}</p>
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
              <p className="font-mono text-[10px] uppercase tracking-widest text-stone-500 mb-2">{h.addressLabel}</p>
              <p className="font-serif text-stone-900 text-lg">{VENUE_ADDRESS}</p>
            </div>
            <p className="font-serif italic text-stone-600 leading-relaxed">{h.directionsText}</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-stone-500">{h.appleMapsNote}</p>
            <button
              onClick={() => openMapsLink(`${VENUE_NAME}, ${VENUE_ADDRESS}`)}
              className="self-start py-2.5 px-6 border border-stone-800 text-stone-900 font-mono text-xs uppercase tracking-widest hover:bg-stone-900 hover:text-[#dbe9e6] transition-colors"
            >
              {h.openInMaps}
            </button>
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
          <p className="font-serif italic text-stone-600 text-lg leading-relaxed">{h.giftsText}</p>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-stone-300 py-16 px-6 text-center">
        <p className="font-serif italic text-stone-500 mb-4 text-sm">{h.footerTeaser}</p>
        <button
          onClick={onViewExperience}
          className="font-mono text-xs uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors underline decoration-dotted underline-offset-4 cursor-pointer"
        >
          {h.footerLink}
        </button>
      </footer>

    </div>
  );
};

export default HomePage;
