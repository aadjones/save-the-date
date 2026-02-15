export interface TimeModuleProps {
  targetDate: Date;
  isActive: boolean;
  onScrolledToBottom?: (atBottom: boolean) => void;
}

export interface CountdownTime {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export enum SocialUnit {
  WEEKENDS = 'Weekends',
  MEALS = 'Meals',
  HOLIDAYS = 'Federal Holidays',
}

export enum AbsurdUnit {
  NETFLIX = 'Netflix Miniseries',
  CAT_NAPS = 'Cat Naps',
  OH_SHIT = 'Existential Panics',
  HEARTBEATS = 'Heartbeats',
}