// Generate .ics file for calendar event
export const generateIcsFile = (
  title: string,
  date: Date,
  location: string,
  description?: string
): void => {
  // Format date for ICS (YYYYMMDDTHHMMSSZ in UTC)
  // Use the venue's time zone so guests far east of California still get Oct 24
  const formatIcsDate = (d: Date): string =>
    d.toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' }).replace(/-/g, '');

  const eventDate = formatIcsDate(date);
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  // ICS file content
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Save the Date//Wedding Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART;VALUE=DATE:${eventDate}`,
    `DTEND;VALUE=DATE:${eventDate}`,
    `DTSTAMP:${timestamp}`,
    `UID:${timestamp}@savethedate`,
    `SUMMARY:${title}`,
    `LOCATION:${location}`,
    ...(description ? [`DESCRIPTION:${description}`] : []),
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  // Create blob and download
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'wedding-save-the-date.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
