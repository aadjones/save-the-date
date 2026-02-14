export type Locale = 'en' | 'es';

export type Translations = {
  app: {
    title: string;
    date: string;
    calendarTitle: string;
    calendarDescription: string;
    locationAriaLabel: string;
    calendarAriaLabel: string;
    shuffleAriaLabel: string;
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
  orbit: {
    header: string;
    wedding: string;
    engaged: string;
    youAreHere: string;
    arc: string;
    km: string;
    orbits: string;
  };
  seasonal: {
    header: string;
    winter: string;
    spring: string;
    summer: string;
    fall: string;
    winterSolstice: string;
    vernalEquinox: string;
    summerSolstice: string;
    autumnalEquinox: string;
    youAreHere: string;
    wedding: string;
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
  social: {
    header: string;
    weekends: string;
    meals: string;
    holidays: string;
    weekendsTooltip: string;
    mealsTooltip: string;
    holidaysTooltip: string;
    remaining: string;
    footer: string;
  };
  absurd: {
    header: string;
    netflix: string;
    catNaps: string;
    existentialPanics: string;
    heartbeats: string;
    tapHint: string;
    stressNote: string;
    bpmNote: string;
  };
  clock: {
    header: string;
    seconds: string;
    minutes: string;
    hours: string;
    week: string;
    lunarPhase: string;
    month: string;
    solarYear: string;
    siderealDay: string;
    theCountdown: string;
    descSeconds: string;
    descMinutes: string;
    descHours: string;
    descWeek: string;
    descLunarPhase: string;
    descMonth: string;
    descSolarYear: string;
    descSiderealDay: string;
    descCountdown: string;
    scrollHint: string;
  };
};

export { en } from './en';
export { es } from './es';
