import { buildInviteData } from '../components/themes/invitation-modern/adapters';
import { inviteFamilyFor } from '../components/themes/invitation-modern/routing';

// Calendar entries (Google Calendar link and .ics file) for an invitation's main event.

export interface CalendarEvent {
  title: string;
  start: Date;
  allDay: boolean;
  location: string;
  description: string;
}

const EVENT_HOURS = 3;

// "10:30 AM", "7 PM onwards", "18:00" -> [hours, minutes]
const parseTime = (text?: string): [number, number] | null => {
  const m = (text || '').match(/(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)?/i);
  if (!m) return null;
  let h = Number(m[1]);
  const min = Number(m[2] || 0);
  const ampm = (m[3] || '').toLowerCase().replace(/\./g, '');
  if (ampm === 'pm' && h < 12) h += 12;
  if (ampm === 'am' && h === 12) h = 0;
  if (h > 23 || min > 59 || (!m[2] && !ampm)) return null;
  return [h, min];
};

/** The invitation's main event, or null when there is no usable date (e.g. religious org sites). */
export function getInvitationEvent(content: any, website: any): CalendarEvent | null {
  const family = inviteFamilyFor(website?.business_type);
  if (!family || family === 'religious') return null;
  const d = buildInviteData(family, content, website);
  const raw = family === 'collegeFest' ? {} : content?.settings_json?.[family] || {};

  const candidates = [raw.countdownDate, raw.date, content?.date, d.dateParts.day && `${d.dateParts.month} ${d.dateParts.day}, ${d.dateParts.year}`];
  let start: Date | null = null;
  let hasTime = false;
  for (const c of candidates) {
    if (!c) continue;
    // "2026-12-12" alone parses as UTC midnight (the previous day west of UTC); read it as a local date.
    const ymd = String(c).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const dt = ymd ? new Date(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3])) : new Date(c);
    if (isNaN(dt.getTime())) continue;
    start = dt;
    hasTime = /T\d{2}:\d{2}/.test(String(c));
    break;
  }
  if (!start) return null;

  if (!hasTime) {
    const t = parseTime(d.timeText);
    if (t) {
      start.setHours(t[0], t[1], 0, 0);
      hasTime = true;
    }
  }

  const title =
    family === 'wedding'
      ? `${d.title} — ${/engagement/i.test(website?.business_type || '') ? 'Engagement' : 'Wedding'}`
      : family === 'birthday'
        ? `${d.title}'s Birthday`
        : family === 'housewarming'
          ? `Housewarming — ${d.title}`
          : d.title;
  const location = [d.venueName, d.address].filter((v, i, a) => v && a.indexOf(v) === i).join(', ');
  const link = website?.slug ? `${window.location.origin}/${website.slug}` : window.location.href;
  return { title, start, allDay: !hasTime, location, description: `${d.subtitle}\n\nInvitation: ${link}` };
}

const pad = (n: number) => String(n).padStart(2, '0');
const stamp = (dt: Date, allDay: boolean) =>
  `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}` + (allDay ? '' : `T${pad(dt.getHours())}${pad(dt.getMinutes())}00`);
const endOf = (e: CalendarEvent) => {
  const end = new Date(e.start);
  if (e.allDay) end.setDate(end.getDate() + 1);
  else end.setHours(end.getHours() + EVENT_HOURS);
  return end;
};

export const googleCalendarUrl = (e: CalendarEvent) =>
  'https://calendar.google.com/calendar/render?' +
  new URLSearchParams({
    action: 'TEMPLATE',
    text: e.title,
    dates: `${stamp(e.start, e.allDay)}/${stamp(endOf(e), e.allDay)}`,
    details: e.description,
    location: e.location,
  }).toString();

const icsEscape = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');

export const icsDataUrl = (e: CalendarEvent) => {
  const dateProp = (name: string, dt: Date) => (e.allDay ? `${name};VALUE=DATE:${stamp(dt, true)}` : `${name}:${stamp(dt, false)}`);
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Jaalam//Invitation//EN', 'BEGIN:VEVENT',
    `UID:${e.start.getTime()}-${encodeURIComponent(e.title).slice(0, 40)}@jaalam`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    dateProp('DTSTART', e.start), dateProp('DTEND', endOf(e)),
    `SUMMARY:${icsEscape(e.title)}`, `DESCRIPTION:${icsEscape(e.description)}`, `LOCATION:${icsEscape(e.location)}`,
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
};
