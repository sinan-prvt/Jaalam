// Section order used when an invitation has no saved section list yet (e.g. it was
// never opened in the editor). Without it the ordered layouts rendered an empty page.
export const DEFAULT_HOUSEWARMING_SECTIONS = [
  { id: 'hero', label: 'Cover / Hero', visible: true, locked: true },
  { id: 'hosts', label: 'Host Details', visible: true },
  { id: 'story', label: 'Welcome Message', visible: true },
  { id: 'schedule', label: 'Event Schedule', visible: true },
  { id: 'venue', label: 'New Home Location', visible: true },
  { id: 'gallery', label: 'Gallery', visible: true },
  { id: 'rsvp', label: 'RSVP', visible: true },
];
