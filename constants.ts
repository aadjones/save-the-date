export const TARGET_DATE = new Date('2026-09-20T00:00:00');
export const ENGAGEMENT_DATE = new Date('2025-12-19T00:00:00');

// Wedding venue information
export const VENUE_NAME = 'Twin Oaks House Weddings';
export const VENUE_ADDRESS = '236 Deer Springs Rd, San Marcos, CA 92069';
export const VENUE_COORDINATES = '33°10\'43.0"N 117°11\'33.0"W'; // Display format

export const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
export const MILLISECONDS_PER_SIDEREAL_DAY = 86164090.5; // ~23h 56m 4.0905s
export const MILLISECONDS_PER_SOLAR_DAY = 86400000;
export const SYNODIC_MONTH_DAYS = 29.53059;
export const EARTH_ORBIT_KM = 940000000; // Approx circumference
export const DAYS_PER_YEAR = 365.2564; // Sidereal year

// Reference date for new moon (Jan 11, 2024 was a new moon)
export const REFERENCE_NEW_MOON = new Date('2024-01-11T11:57:00');

export const ABSURD_CONVERSIONS = {
  NETFLIX_MINISERIES_HOURS: 8, // Approx 8 hours per limited series
  CAT_NAP_HOURS: 0.5, // 30 mins
  MEALS_PER_DAY: 3,
  OH_SHIT_FACTOR: 0.2, // One per 5 days on average as the date approaches? This is a curve logic constant.
  HEARTBEAT_BPM: 70,
};