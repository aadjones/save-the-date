export type Locale = 'en' | 'es';

export type Translations = {
  app: {
    title: string;
    date: string;
    calendarTitle: string;
    calendarDescription: string;
    locationAriaLabel: string;
    calendarAriaLabel: string;
  };
  standard: {
    header: string;
    years: string;
    months: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    footer: string;
  };
  lunar: {
    header: string;
    scrollHint: string;
    youAreHere: string;
    theWedding: string;
    theBigDay: string;
    newMoon: string;
    firstQuarter: string;
    fullMoon: string;
    lastQuarter: string;
    waxingCrescent: string;
    waxingGibbous: string;
    waningGibbous: string;
    waningCrescent: string;
  };
};

export { en } from './en';
export { es } from './es';
