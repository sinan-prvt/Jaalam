import { createContext } from 'react';

/** Which site a theme is rendering, for parts that talk to the backend (RSVP form). */
export interface SiteInfo {
  slug?: string;
  /** Editor preview: show the flow but don't save anything. */
  preview?: boolean;
}

export const SiteContext = createContext<SiteInfo>({});
