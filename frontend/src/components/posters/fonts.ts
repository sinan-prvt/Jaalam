/**
 * Fonts the poster maker offers. Every stack ends with a Malayalam face, so
 * Malayalam text (ഓണാശംസകൾ...) renders nicely whatever Latin font is picked.
 */
const ML = "'Baloo Chettan 2','Manjari'";

export const POSTER_FONTS = {
  baloo: { label: 'Baloo Chettan (Malayalam)', css: `'Baloo Chettan 2','Manjari',sans-serif`, q: 'Baloo+Chettan+2:wght@500;700;800' },
  manjari: { label: 'Manjari (Malayalam)', css: `'Manjari',sans-serif`, q: 'Manjari:wght@400;700' },
  notoSerifMl: { label: 'Noto Serif Malayalam', css: `'Noto Serif Malayalam',serif`, q: 'Noto+Serif+Malayalam:wght@400;700;900' },
  anekMl: { label: 'Anek Malayalam (bold poster)', css: `'Anek Malayalam','Baloo Chettan 2',sans-serif`, q: 'Anek+Malayalam:wght@500;700;800' },
  notoSansMl: { label: 'Noto Sans Malayalam Black', css: `'Noto Sans Malayalam','Baloo Chettan 2',sans-serif`, q: 'Noto+Sans+Malayalam:wght@400;700;900' },
  gayathri: { label: 'Gayathri (Malayalam)', css: `'Gayathri','Manjari',sans-serif`, q: 'Gayathri:wght@400;700' },
  chilanka: { label: 'Chilanka (Malayalam hand)', css: `'Chilanka',${ML},cursive`, q: 'Chilanka' },
  playfair: { label: 'Playfair Display', css: `'Playfair Display',${ML},serif`, q: 'Playfair+Display:ital,wght@0,500;0,700;0,900;1,600' },
  cinzel: { label: 'Cinzel', css: `'Cinzel',${ML},serif`, q: 'Cinzel:wght@500;700;900' },
  cormorant: { label: 'Cormorant', css: `'Cormorant Garamond',${ML},serif`, q: 'Cormorant+Garamond:ital,wght@0,500;0,700;1,500' },
  dmSerif: { label: 'DM Serif', css: `'DM Serif Display',${ML},serif`, q: 'DM+Serif+Display:ital@0;1' },
  bebas: { label: 'Bebas Neue', css: `'Bebas Neue',${ML},sans-serif`, q: 'Bebas+Neue' },
  anton: { label: 'Anton', css: `'Anton',${ML},sans-serif`, q: 'Anton' },
  oswald: { label: 'Oswald', css: `'Oswald',${ML},sans-serif`, q: 'Oswald:wght@500;700' },
  poppins: { label: 'Poppins', css: `'Poppins',${ML},sans-serif`, q: 'Poppins:wght@400;600;800' },
  outfit: { label: 'Outfit', css: `'Outfit',${ML},sans-serif`, q: 'Outfit:wght@400;600;800' },
  montserrat: { label: 'Montserrat', css: `'Montserrat',${ML},sans-serif`, q: 'Montserrat:wght@400;600;800;900' },
  archivo: { label: 'Archivo Black', css: `'Archivo Black',${ML},sans-serif`, q: 'Archivo+Black' },
  righteous: { label: 'Righteous', css: `'Righteous',${ML},sans-serif`, q: 'Righteous' },
  pacifico: { label: 'Pacifico', css: `'Pacifico',${ML},cursive`, q: 'Pacifico' },
  greatVibes: { label: 'Great Vibes', css: `'Great Vibes',${ML},cursive`, q: 'Great+Vibes' },
  lobster: { label: 'Lobster', css: `'Lobster',${ML},cursive`, q: 'Lobster' },
  marcellus: { label: 'Marcellus', css: `'Marcellus',${ML},serif`, q: 'Marcellus' },
  // Modern / trending
  spaceGrotesk: { label: 'Space Grotesk', css: `'Space Grotesk',${ML},sans-serif`, q: 'Space+Grotesk:wght@400;500;700' },
  syne: { label: 'Syne', css: `'Syne',${ML},sans-serif`, q: 'Syne:wght@600;700;800' },
  unbounded: { label: 'Unbounded', css: `'Unbounded',${ML},sans-serif`, q: 'Unbounded:wght@500;700;900' },
  instrument: { label: 'Instrument Serif', css: `'Instrument Serif',${ML},serif`, q: 'Instrument+Serif:ital@0;1' },
  bricolage: { label: 'Bricolage Grotesque', css: `'Bricolage Grotesque',${ML},sans-serif`, q: 'Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800' },
  interTight: { label: 'Inter Tight', css: `'Inter Tight',${ML},sans-serif`, q: 'Inter+Tight:wght@400;500;700;900' },
  dmSans: { label: 'DM Sans', css: `'DM Sans',${ML},sans-serif`, q: 'DM+Sans:wght@400;500;700' },
  sora: { label: 'Sora', css: `'Sora',${ML},sans-serif`, q: 'Sora:wght@400;600;800' },
  delaGothic: { label: 'Dela Gothic One', css: `'Dela Gothic One',${ML},sans-serif`, q: 'Dela+Gothic+One' },
  fraunces: { label: 'Fraunces', css: `'Fraunces',${ML},serif`, q: 'Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,800;1,9..144,500' },
} as const;

export type PosterFontKey = keyof typeof POSTER_FONTS;

/** One stylesheet link for every poster font (loaded once by the poster maker). */
export const POSTER_FONTS_HREF =
  'https://fonts.googleapis.com/css2?' +
  Object.values(POSTER_FONTS).map(f => `family=${f.q}`).join('&') +
  '&display=swap';
