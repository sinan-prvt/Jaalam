import type { ReactNode } from 'react';
import * as Kerala from './kerala';
import * as Modern from './modern';
import * as Classic from './classic';
import * as Creative from './creative';
import * as Extra from './creativeExtra';
import * as English from './english';
import type { LayoutProps } from './text';
import type { LayoutKey, Palette, PosterFontKey } from './types';

/** Layout registries: which layout components exist, with their labels, palettes and fonts. */

const pal = (bg: string, bg2: string, ink: string, accent: string, accent2: string, onAccent: string): Palette => ({ bg, bg2, ink, accent, accent2, onAccent });

type KeralaLayout = { label: string; render: (L: LayoutProps) => ReactNode; palettes: Palette[]; fonts: [PosterFontKey, PosterFontKey][] };

export const KERALA_LAYOUTS: Record<string, KeralaLayout> = {
  adProduct: { label: 'Product showcase', render: Kerala.AdProduct, fonts: [['anekMl', 'poppins'], ['baloo', 'montserrat']], palettes: [
    pal('#8a8178', '#bdb4a8', '#ffffff', '#3a2f26', '#f5c518', '#ffffff'), pal('#0f3b2e', '#2f6b55', '#ffffff', '#0a2219', '#facc15', '#ffffff'), pal('#3b0d1a', '#7a2440', '#ffffff', '#1a0610', '#fbbf24', '#ffffff')] },
  adGiantLetter: { label: 'Giant letter', render: Kerala.AdGiantLetter, fonts: [['anekMl', 'poppins'], ['notoSansMl', 'montserrat']], palettes: [
    pal('#6e3a3e', '#8e5258', '#f6eadf', '#e8b4a0', '#fde68a', '#3b1d20'), pal('#25343f', '#3b5262', '#eef4f8', '#7dd3fc', '#fde68a', '#0f1a22'), pal('#3f4a2f', '#5b6b43', '#f4f1e6', '#d9f99d', '#fde68a', '#1f2615')] },
  adServices: { label: 'Services night', render: Kerala.AdServices, fonts: [['baloo', 'poppins'], ['anekMl', 'montserrat']], palettes: [
    pal('#0b1033', '#3b2a7a', '#ffffff', '#f59e0b', '#9a3412', '#111111'), pal('#04211c', '#0f5b4b', '#ffffff', '#facc15', '#a16207', '#111111'), pal('#1a0b2e', '#6d28d9', '#ffffff', '#fb7185', '#9f1239', '#111111')] },
  adPromo: { label: 'Price promo', render: Kerala.AdPromo, fonts: [['anekMl', 'poppins'], ['baloo', 'montserrat']], palettes: [
    pal('#f6f3ee', '#e9d8c4', '#1a1a1a', '#e11d48', '#111111', '#ffffff'), pal('#fff7e6', '#ffe0a3', '#1f1300', '#ea580c', '#111111', '#ffffff'), pal('#eef6ff', '#cfe3ff', '#0b1b33', '#2563eb', '#111111', '#ffffff')] },
  adEvent: { label: 'Event & bunting', render: Kerala.AdEvent, fonts: [['notoSansMl', 'poppins'], ['anekMl', 'montserrat']], palettes: [
    pal('#fef3c7', '#bbf7d0', '#1f1300', '#e11d48', '#7c2d12', '#ffffff'), pal('#ecfccb', '#bae6fd', '#0f1f10', '#9333ea', '#be123c', '#ffffff'), pal('#ffedd5', '#fde68a', '#291400', '#dc2626', '#1d4ed8', '#ffffff')] },
  adArch: { label: 'Arch & lanterns', render: Kerala.AdArch, fonts: [['notoSerifMl', 'manjari'], ['baloo', 'poppins']], palettes: [
    pal('#3b1d0e', '#5c2a14', '#fdf1d6', '#e9b44c', '#fde68a', '#3b1d0e'), pal('#0c2a24', '#134e43', '#e9fff8', '#d4af37', '#fde68a', '#0c2a24'), pal('#1e1338', '#31205a', '#f4efff', '#e9c46a', '#fde68a', '#1e1338')] },
  adFestival: { label: 'Festival glow', render: Kerala.AdFestival, fonts: [['chilanka', 'poppins'], ['baloo', 'montserrat'], ['anekMl', 'poppins']], palettes: [
    pal('#3b1a00', '#b45309', '#fff7e6', '#7c2d12', '#fde047', '#ffffff'), pal('#0b3d2e', '#4d9b6e', '#ffffff', '#14532d', '#fef08a', '#ffffff'), pal('#3b0764', '#a855f7', '#ffffff', '#6b21a8', '#f9a8d4', '#ffffff')] },
  adAchievement: { label: 'Winner card', render: Kerala.AdAchievement, fonts: [['notoSansMl', 'poppins'], ['anekMl', 'montserrat']], palettes: [
    pal('#04381f', '#0b6b3a', '#ffffff', '#86efac', '#fde68a', '#04381f'), pal('#0b1d4d', '#1d4ed8', '#ffffff', '#93c5fd', '#fde68a', '#0b1d4d'), pal('#4a0d0d', '#9f1239', '#ffffff', '#fda4af', '#fde68a', '#4a0d0d')] },
  adClinic: { label: 'Clinic & course', render: Kerala.AdClinic, fonts: [['anekMl', 'poppins'], ['notoSansMl', 'montserrat']], palettes: [
    pal('#dff7f3', '#9ee6dc', '#0b3b3a', '#0f766e', '#134e4a', '#ffffff'), pal('#e0f2fe', '#a5d8ff', '#0c2a4a', '#0369a1', '#0c4a6e', '#ffffff'), pal('#fdf2f8', '#fbcfe8', '#4a0d2e', '#be185d', '#831843', '#ffffff')] },
  adNews: { label: 'News card', render: Kerala.AdNews, fonts: [['anekMl', 'poppins'], ['notoSansMl', 'montserrat']], palettes: [
    pal('#ffffff', '#f1f5f9', '#111111', '#facc15', '#dc2626', '#111111'), pal('#ffffff', '#f1f5f9', '#111111', '#4ade80', '#1d4ed8', '#111111'), pal('#ffffff', '#f1f5f9', '#111111', '#fb923c', '#7c3aed', '#111111')] },
  adFood: { label: 'Food promo', render: Kerala.AdFood, fonts: [['dmSerif', 'poppins'], ['anekMl', 'poppins']], palettes: [
    pal('#6b3a1e', '#5a3018', '#fff7ed', '#fbbf24', '#3f6212', '#3b2412'), pal('#3a2a1f', '#2e2118', '#fdf6ec', '#f97316', '#166534', '#3b2412'), pal('#4a1d1d', '#3c1717', '#fff1f2', '#fde047', '#15803d', '#3b2412')] },
  adMap: { label: 'Kerala map', render: Kerala.AdMap, fonts: [['notoSansMl', 'poppins'], ['anekMl', 'montserrat']], palettes: [
    pal('#ffffff', '#f0fdf4', '#14532d', '#15803d', '#b45309', '#ffffff'), pal('#fffbeb', '#fef3c7', '#422006', '#b45309', '#15803d', '#ffffff'), pal('#f0f9ff', '#e0f2fe', '#0c4a6e', '#0e7490', '#c2410c', '#ffffff')] },
};

type AdLayout = { label: string; render: (L: LayoutProps) => ReactNode; palettes: Palette[]; fonts: [PosterFontKey, PosterFontKey][] };

const ML_FONTS: [PosterFontKey, PosterFontKey][] = [['anekMl', 'poppins'], ['notoSansMl', 'montserrat'], ['baloo', 'outfit']];

/** Creative agency-style ads; each has its own palettes, picked per template. */
export const CREATIVE_LAYOUTS: Record<string, AdLayout> = {
  cStudio: { label: 'Photo studio', render: Creative.CStudio, fonts: ML_FONTS, palettes: [
    pal('#5b3a2c', '#7a5240', '#ffffff', '#f5d0a9', '#ffffff', '#3b2418'), pal('#2a2a6e', '#3b3b9a', '#ffffff', '#facc15', '#ffffff', '#1a1a40'), pal('#0f2e2a', '#164e45', '#ffffff', '#5eead4', '#ffffff', '#062421'), pal('#3b0d1f', '#6b1a38', '#ffffff', '#fda4af', '#ffffff', '#3b0d1f')] },
  cSpotlight: { label: 'Product spotlight', render: Creative.CSpotlight, fonts: ML_FONTS, palettes: [
    pal('#3a1404', '#7a2e0a', '#ffffff', '#ff7a1a', '#ffd23f', '#2b1203'), pal('#0b1238', '#1d2a7a', '#ffffff', '#3b82f6', '#a5f3fc', '#0b1238'), pal('#2a0a2e', '#5b1466', '#ffffff', '#d946ef', '#fde68a', '#2a0a2e'), pal('#062b1d', '#0d5c3c', '#ffffff', '#10b981', '#fef08a', '#062b1d')] },
  cTiltBanners: { label: 'Tilted banners', render: Creative.CTiltBanners, fonts: ML_FONTS, palettes: [
    pal('#0b2e3a', '#0f766e', '#ffffff', '#14b8a6', '#ffffff', '#06231c'), pal('#1e1b4b', '#4338ca', '#ffffff', '#f59e0b', '#ffffff', '#1e1b4b'), pal('#3b0a0a', '#b91c1c', '#ffffff', '#facc15', '#ffffff', '#3b0a0a'), pal('#0c2340', '#1d4ed8', '#ffffff', '#22c55e', '#ffffff', '#0c2340')] },
  cSolidCutout: { label: 'Solid colour cut-out', render: Creative.CSolidCutout, fonts: ML_FONTS, palettes: [
    pal('#16a34a', '#4ade80', '#ffffff', '#111111', '#fef08a', '#ffffff'), pal('#2563eb', '#60a5fa', '#ffffff', '#dc2626', '#fde68a', '#ffffff'), pal('#ea580c', '#fb923c', '#ffffff', '#111111', '#fff7ed', '#ffffff'), pal('#7c3aed', '#a78bfa', '#ffffff', '#facc15', '#fef9c3', '#1e1b4b')] },
  cBillboard: { label: 'Billboard', render: Creative.CBillboard, fonts: ML_FONTS, palettes: [
    pal('#b91c1c', '#ffffff', '#111111', '#b91c1c', '#111111', '#ffffff'), pal('#1d4ed8', '#ffffff', '#111111', '#1d4ed8', '#111111', '#ffffff'), pal('#7c3aed', '#ffffff', '#111111', '#7c3aed', '#111111', '#ffffff'), pal('#047857', '#ffffff', '#111111', '#047857', '#111111', '#ffffff')] },
  cSpeech: { label: 'Speech bubble', render: Creative.CSpeech, fonts: ML_FONTS, palettes: [
    pal('#1e3a8a', '#ffffff', '#ffffff', '#1d4ed8', '#ffffff', '#ffffff'), pal('#7c2d12', '#ffffff', '#ffffff', '#ea580c', '#ffffff', '#ffffff'), pal('#14532d', '#ffffff', '#ffffff', '#16a34a', '#ffffff', '#ffffff'), pal('#831843', '#ffffff', '#ffffff', '#db2777', '#ffffff', '#ffffff')] },
  cWallType: { label: 'Wall type', render: Creative.CWallType, fonts: [['notoSansMl', 'montserrat'], ['anekMl', 'poppins']], palettes: [
    pal('#6e3a3e', '#8a5a3c', '#f6e7d7', '#e8b4a0', '#ffffff', '#3b1d20'), pal('#2f3e46', '#7a5a3a', '#eef2ef', '#cad2c5', '#ffffff', '#1b2429'), pal('#4a3b2a', '#6b4f33', '#f3ead8', '#d4a373', '#ffffff', '#2a2117'), pal('#d9d4cc', '#9c7b5b', '#2b2620', '#5c4a3a', '#ffffff', '#ffffff')] },
  cSurreal: { label: 'Surreal sky', render: Creative.CSurreal, fonts: ML_FONTS, palettes: [
    pal('#4b6b3a', '#9cc3e6', '#1f2937', '#c8a24a', '#f5d98a', '#111111'), pal('#7a5a2e', '#a8d0f0', '#1f1a12', '#b8862b', '#f9d976', '#111111'), pal('#3b4a6b', '#f9c6a0', '#1a1a2e', '#e07a5f', '#f2cc8f', '#111111'), pal('#2d5a4a', '#bfe3f5', '#10261f', '#d4a017', '#fff1a8', '#111111')] },
  cPins: { label: 'Map pins', render: Creative.CPins, fonts: ML_FONTS, palettes: [
    pal('#f4f6f8', '#e1e6ec', '#111111', '#e11d48', '#1d4ed8', '#ffffff'), pal('#fffaf0', '#efe6d5', '#111111', '#ea580c', '#7c2d12', '#ffffff'), pal('#f0fdf4', '#d9eadf', '#111111', '#16a34a', '#14532d', '#ffffff'), pal('#f5f3ff', '#e4e0f5', '#111111', '#7c3aed', '#be123c', '#ffffff')] },
  cCaricature: { label: 'Caricature pop', render: Creative.CCaricature, fonts: ML_FONTS, palettes: [
    pal('#4a0230', '#b0125e', '#ffffff', '#e11d48', '#f5c451', '#3a0020'), pal('#0a1a4a', '#1e40af', '#ffffff', '#f97316', '#fde68a', '#061033'), pal('#2e0854', '#7e22ce', '#ffffff', '#22c55e', '#fcd34d', '#1a0533'), pal('#3b1d00', '#b45309', '#ffffff', '#dc2626', '#fef08a', '#2b1300')] },
  cMinimalProduct: { label: 'Minimal product', render: Creative.CMinimalProduct, fonts: [['notoSansMl', 'poppins'], ['anekMl', 'montserrat']], palettes: [
    pal('#c9a227', '#e0bc4a', '#3b2412', '#4a2c17', '#7c2d12', '#ffffff'), pal('#d6e4dc', '#eef5f1', '#1f2d27', '#0f766e', '#b45309', '#ffffff'), pal('#f3d9d0', '#fbeae4', '#3a1d17', '#b91c1c', '#6b2d20', '#ffffff'), pal('#1f2937', '#374151', '#f9fafb', '#fbbf24', '#93c5fd', '#111111')] },
  cDarkPromo: { label: 'Dark promo', render: Creative.CDarkPromo, fonts: [['anton', 'poppins'], ['anekMl', 'montserrat'], ['bebas', 'outfit']], palettes: [
    pal('#151515', '#2a2a2a', '#ffffff', '#facc15', '#ffffff', '#111111'), pal('#0f1f14', '#1f3a26', '#ffffff', '#84cc16', '#fef9c3', '#0f1f14'), pal('#1a0f0a', '#3a2014', '#ffffff', '#f97316', '#fde68a', '#1a0f0a'), pal('#1a1033', '#2e1d5c', '#ffffff', '#f472b6', '#fde68a', '#1a1033')] },
  cFestiveMascot: { label: 'Festive mascot', render: Creative.CFestiveMascot, fonts: [['playfair', 'poppins'], ['dmSerif', 'outfit'], ['baloo', 'poppins']], palettes: [
    pal('#14532d', '#d9f99d', '#1a2e05', '#c2410c', '#ca8a04', '#ffffff'), pal('#7f1d1d', '#fde68a', '#3b0d0d', '#b91c1c', '#a16207', '#ffffff'), pal('#1e3a8a', '#bfdbfe', '#0b1b3a', '#1d4ed8', '#ca8a04', '#ffffff'), pal('#064e3b', '#a7f3d0', '#022c22', '#047857', '#b45309', '#ffffff')] },
  cBloom: { label: 'Golden bloom', render: Creative.CBloom, fonts: ML_FONTS, palettes: [
    pal('#1d3fb8', '#3b6bff', '#ffffff', '#facc15', '#fde68a', '#0b1d6b'), pal('#7e1d4f', '#c02672', '#ffffff', '#fbbf24', '#fde68a', '#3b0a24'), pal('#065f46', '#10b981', '#ffffff', '#fde047', '#fef9c3', '#022c22'), pal('#4c1d95', '#7c3aed', '#ffffff', '#fcd34d', '#fef3c7', '#2e1065')] },
  cEventBanner: { label: 'Event banner', render: Creative.CEventBanner, fonts: [['notoSansMl', 'poppins'], ['anekMl', 'montserrat']], palettes: [
    pal('#fffbe8', '#fde68a', '#3b0d0d', '#be123c', '#6b21a8', '#ffffff'), pal('#f0fdf4', '#bbf7d0', '#14532d', '#15803d', '#1d4ed8', '#ffffff'), pal('#fff7ed', '#fed7aa', '#431407', '#c2410c', '#7c2d12', '#ffffff'), pal('#eff6ff', '#bfdbfe', '#172554', '#1d4ed8', '#be123c', '#ffffff')] },
  cPolaroid: { label: 'Polaroid board', render: Extra.CPolaroid, fonts: ML_FONTS, palettes: [
    pal('#fdf6ec', '#eadcc8', '#2b2118', '#e85d3a', '#2f80ed', '#ffffff'), pal('#eef6f3', '#cfe3dc', '#16302a', '#0f9d76', '#f2994a', '#ffffff'), pal('#fff1f3', '#f7d3da', '#3a1520', '#e23d6b', '#6c5ce7', '#ffffff'), pal('#f1f3ff', '#d6dcf7', '#1a2048', '#4f5bd5', '#f2b705', '#ffffff')] },
  cCircleHero: { label: 'Circle hero', render: Extra.CCircleHero, fonts: ML_FONTS, palettes: [
    pal('#fff7ed', '#ffe4c4', '#2b1406', '#ea580c', '#facc15', '#ffffff'), pal('#ecfeff', '#c6f3f7', '#0b2b30', '#0891b2', '#f43f5e', '#ffffff'), pal('#f5f3ff', '#ddd6fe', '#1e1240', '#7c3aed', '#f59e0b', '#ffffff'), pal('#f0fdf4', '#c7f0d6', '#062b15', '#16a34a', '#f97316', '#ffffff')] },
  cGlassCard: { label: 'Glass card', render: Extra.CGlassCard, fonts: ML_FONTS, palettes: [
    pal('#1e1b4b', '#0ea5e9', '#ffffff', '#ec4899', '#8b5cf6', '#ffffff'), pal('#0f172a', '#14b8a6', '#ffffff', '#f97316', '#eab308', '#ffffff'), pal('#3b0764', '#22d3ee', '#ffffff', '#f43f5e', '#a855f7', '#ffffff'), pal('#052e16', '#84cc16', '#ffffff', '#06b6d4', '#facc15', '#ffffff')] },
  cComic: { label: 'Comic pop', render: Extra.CComic, fonts: ML_FONTS, palettes: [
    pal('#ffe14d', '#f5c400', '#111111', '#ff3b3b', '#ffd23f', '#ffffff'), pal('#7ee8fa', '#5bd3ea', '#111111', '#ff4fa3', '#ffe14d', '#ffffff'), pal('#ff8c42', '#f2731c', '#111111', '#2563eb', '#ffe14d', '#ffffff'), pal('#b6f36b', '#9ee04d', '#111111', '#7c3aed', '#ffe14d', '#ffffff')] },
  cPhone: { label: 'Phone mockup', render: Extra.CPhone, fonts: ML_FONTS, palettes: [
    pal('#ff6b35', '#f7931e', '#ffffff', '#111111', '#ffe14d', '#ffffff'), pal('#4f46e5', '#7c3aed', '#ffffff', '#22c55e', '#facc15', '#ffffff'), pal('#0f766e', '#14b8a6', '#ffffff', '#f97316', '#fde047', '#ffffff'), pal('#be123c', '#f43f5e', '#ffffff', '#111111', '#fde68a', '#ffffff')] },
  cArchWindow: { label: 'Arch window', render: Extra.CArchWindow, fonts: [['notoSerifMl', 'poppins'], ['notoSansMl', 'montserrat'], ['anekMl', 'outfit']], palettes: [
    pal('#f6efe6', '#e9dccb', '#3a2a1c', '#b07d4f', '#7a8b5e', '#ffffff'), pal('#f3f1ec', '#e2ddd2', '#26302b', '#5f7a61', '#b88a5a', '#ffffff'), pal('#f8efef', '#ecd8d6', '#3b1f24', '#a8505f', '#c9a227', '#ffffff'), pal('#eef1f6', '#d8dfeb', '#1d2a3f', '#3f5f8a', '#c79a4a', '#ffffff')] },
  cStripeBold: { label: 'Hazard stripes', render: Extra.CStripeBold, fonts: ML_FONTS, palettes: [
    pal('#111111', '#222222', '#ffffff', '#facc15', '#ffffff', '#111111'), pal('#1f2937', '#374151', '#ffffff', '#fb923c', '#ffffff', '#111111'), pal('#0b1d3a', '#13294b', '#ffffff', '#facc15', '#ffffff', '#111111'), pal('#2b0b0b', '#3d1414', '#ffffff', '#f87171', '#ffffff', '#111111')] },
  cTornPaper: { label: 'Torn paper', render: Extra.CTornPaper, fonts: ML_FONTS, palettes: [
    pal('#fffaf0', '#f3e6cf', '#2a1d10', '#d9480f', '#2b8a3e', '#ffffff'), pal('#f4fbff', '#d8ecf7', '#0b2238', '#1971c2', '#f08c00', '#ffffff'), pal('#fff5f5', '#ffe0e0', '#3b0d0d', '#c92a2a', '#5f3dc4', '#ffffff'), pal('#f8fff4', '#def5d0', '#173011', '#2f9e44', '#e8590c', '#ffffff')] },
  cBrushReveal: { label: 'Brush reveal', render: Extra.CBrushReveal, fonts: ML_FONTS, palettes: [
    pal('#fff8e7', '#ffe9b3', '#1f1607', '#f59f00', '#ffd43b', '#111111'), pal('#eef7ff', '#cfe6ff', '#0b2440', '#1c7ed6', '#a5d8ff', '#ffffff'), pal('#fff0f6', '#ffd6e7', '#3d0a24', '#e64980', '#fcc2d7', '#ffffff'), pal('#f3fff0', '#d3f9d8', '#0f2d12', '#37b24d', '#b2f2bb', '#ffffff')] },
  cWaves: { label: 'Ocean waves', render: Extra.CWaves, fonts: ML_FONTS, palettes: [
    pal('#e6f7ff', '#bfe9ff', '#06283d', '#1c96c5', '#5ccbf0', '#ffffff'), pal('#fff4e6', '#ffe0b8', '#2d1a05', '#f76707', '#ffa94d', '#ffffff'), pal('#f3f0ff', '#dcd4ff', '#1d1147', '#7048e8', '#b197fc', '#ffffff'), pal('#ebfbee', '#c3f0cb', '#0b2e13', '#2b8a3e', '#69db7c', '#ffffff')] },
  cGoldFrame: { label: 'Gold frame', render: Extra.CGoldFrame, fonts: [['notoSerifMl', 'manjari'], ['baloo', 'poppins'], ['anekMl', 'outfit']], palettes: [
    pal('#4a0e0e', '#6b1a1a', '#fff4dc', '#d4a537', '#fbe7a1', '#4a0e0e'), pal('#0c2b1e', '#143f2c', '#f2f7ea', '#d4a537', '#fbe7a1', '#0c2b1e'), pal('#1a1238', '#2a1f55', '#f3efff', '#d4a537', '#fbe7a1', '#1a1238'), pal('#3d2205', '#5c3609', '#fff6e0', '#e0b04a', '#fde9a8', '#3d2205')] },
  cSplitBanner: { label: 'Split banner', render: Extra.CSplitBanner, fonts: ML_FONTS, palettes: [
    pal('#111827', '#1f2937', '#ffffff', '#facc15', '#fde68a', '#111111'), pal('#14532d', '#166534', '#ffffff', '#fb923c', '#fde68a', '#111111'), pal('#1e3a8a', '#1e40af', '#ffffff', '#f43f5e', '#fde68a', '#ffffff'), pal('#4c0519', '#881337', '#ffffff', '#fbbf24', '#fef3c7', '#111111')] },
  cStickerPop: { label: 'Sticker pop', render: Extra.CStickerPop, fonts: ML_FONTS, palettes: [
    pal('#ffe8f1', '#ffc9de', '#2a0f1c', '#ff4f8b', '#7c5cff', '#ffffff'), pal('#e8fbff', '#bff0fb', '#062a33', '#00a6c8', '#ff8a00', '#ffffff'), pal('#fff7d6', '#ffe98a', '#2b2200', '#ff6b00', '#00b894', '#ffffff'), pal('#eef0ff', '#d0d6ff', '#14183f', '#5a5cff', '#ff5e7e', '#ffffff')] },
  cDuoCircle: { label: 'Before / after', render: Extra.CDuoCircle, fonts: ML_FONTS, palettes: [
    pal('#f8f9fa', '#dee2e6', '#212529', '#e8590c', '#1c7ed6', '#ffffff'), pal('#f3fbf7', '#d3efe2', '#10291d', '#099268', '#f59f00', '#ffffff'), pal('#fbf5ff', '#ead9fb', '#2a1340', '#9c36b5', '#f76707', '#ffffff'), pal('#f1f6ff', '#d6e4ff', '#0f1f3d', '#1c62d6', '#e64980', '#ffffff')] },
  cCalendar: { label: 'Calendar date', render: Extra.CCalendar, fonts: ML_FONTS, palettes: [
    pal('#fff5eb', '#ffe1c4', '#2b1404', '#e8590c', '#f59f00', '#ffffff'), pal('#eef6ff', '#d0e4ff', '#0a1f3c', '#1971c2', '#f08c00', '#ffffff'), pal('#f4fff1', '#d5f5cc', '#11300b', '#2f9e44', '#e8590c', '#ffffff'), pal('#fff0f3', '#ffd2dc', '#3a0d18', '#d6336c', '#7048e8', '#ffffff')] },
  cMosaic: { label: 'Mosaic tiles', render: Extra.CMosaic, fonts: ML_FONTS, palettes: [
    pal('#f6f1ea', '#e8dccb', '#1f1a14', '#e8590c', '#ffd43b', '#ffffff'), pal('#eef3f8', '#d5e1ee', '#0f1d2b', '#1c7ed6', '#ffd43b', '#ffffff'), pal('#f4f0fb', '#e0d6f3', '#1f1237', '#7048e8', '#ffd43b', '#ffffff'), pal('#effaf4', '#d0eedd', '#0e2b1c', '#0ca678', '#ffd43b', '#ffffff')] },
};

/** English posters in contemporary styles; each has its own palettes and fonts. */
export const ENGLISH_LAYOUTS: Record<string, AdLayout> = {
  eBigType: { label: 'Big type', render: English.EBigType, fonts: [['anton', 'interTight'], ['bebas', 'dmSans'], ['archivo', 'interTight']], palettes: [
    pal('#f4f1ea', '#e7e1d4', '#111111', '#ff4d2e', '#111111', '#ffffff'), pal('#111111', '#222222', '#f5f5f5', '#c6ff3d', '#ffffff', '#111111'), pal('#2f4bff', '#2238c9', '#ffffff', '#ffd84d', '#ffffff', '#111111'), pal('#ffe8dc', '#ffd2bd', '#2b1b17', '#7b61ff', '#2b1b17', '#ffffff')] },
  eMagazine: { label: 'Magazine cover', render: English.EMagazine, fonts: [['playfair', 'montserrat'], ['dmSerif', 'interTight'], ['cinzel', 'dmSans']], palettes: [
    pal('#111111', '#222222', '#ffffff', '#ff3b3b', '#ffffff', '#ffffff'), pal('#111111', '#222222', '#ffffff', '#ffd84d', '#ffffff', '#111111'), pal('#111111', '#222222', '#ffffff', '#ffffff', '#ffffff', '#111111'), pal('#111111', '#222222', '#ffffff', '#ff7ab6', '#ffffff', '#111111')] },
  eSplitDiagonal: { label: 'Diagonal split', render: English.ESplitDiagonal, fonts: [['montserrat', 'poppins'], ['archivo', 'dmSans'], ['unbounded', 'interTight']], palettes: [
    pal('#ffffff', '#f1f5f9', '#111827', '#f97316', '#111827', '#ffffff'), pal('#0f172a', '#1e293b', '#f8fafc', '#22d3ee', '#f8fafc', '#0f172a'), pal('#fef3c7', '#fde68a', '#1c1917', '#dc2626', '#1c1917', '#ffffff'), pal('#ecfdf5', '#d1fae5', '#064e3b', '#059669', '#064e3b', '#ffffff')] },
  eLuxury: { label: 'Luxury gold', render: English.ELuxury, fonts: [['cormorant', 'montserrat'], ['marcellus', 'interTight'], ['playfair', 'dmSans']], palettes: [
    pal('#0b0b0b', '#161616', '#f5efe2', '#c9a45c', '#e8d5a8', '#0b0b0b'), pal('#0f1c17', '#16261f', '#f1ece0', '#c9a45c', '#e8d5a8', '#0f1c17'), pal('#1a0f1f', '#26162d', '#f5eef7', '#d4af7a', '#f0dcc0', '#1a0f1f'), pal('#0b1626', '#111f35', '#eef2f8', '#c9a45c', '#e8d5a8', '#0b1626')] },
  eRetro: { label: 'Retro sunset', render: English.ERetro, fonts: [['righteous', 'poppins'], ['lobster', 'outfit'], ['bricolage', 'dmSans']], palettes: [
    pal('#fff1dc', '#f6c453', '#3b2314', '#e8623a', '#a0461f', '#fff1dc'), pal('#f7ecd9', '#7fb7a4', '#2d2a26', '#e9a23b', '#d1495b', '#f7ecd9'), pal('#fde7c8', '#f4a259', '#2b2118', '#bc4b51', '#5b8e7d', '#fde7c8'), pal('#efe6ff', '#ffc2e2', '#2a1a3a', '#ff7a59', '#7c5cff', '#ffffff')] },
  eNeon: { label: 'Neon night', render: English.ENeon, fonts: [['righteous', 'poppins'], ['unbounded', 'spaceGrotesk'], ['syne', 'dmSans']], palettes: [
    pal('#0a0612', '#160e24', '#ffffff', '#ff2bd6', '#2bf5ff', '#0a0612'), pal('#05080f', '#0d1422', '#ffffff', '#39ff88', '#ffd23f', '#05080f'), pal('#0b0410', '#1b0b22', '#ffffff', '#ff4d4d', '#ffc93c', '#0b0410'), pal('#03060e', '#0b1630', '#ffffff', '#5b8cff', '#ff5fa2', '#03060e')] },
  eTicket: { label: 'Event ticket', render: English.ETicket, fonts: [['delaGothic', 'dmSans'], ['anton', 'interTight'], ['bricolage', 'dmSans']], palettes: [
    pal('#7c3aed', '#6d28d9', '#ffffff', '#7c3aed', '#facc15', '#ffffff'), pal('#0f766e', '#115e59', '#ffffff', '#0f766e', '#f97316', '#ffffff'), pal('#be123c', '#9f1239', '#ffffff', '#be123c', '#facc15', '#ffffff'), pal('#1d4ed8', '#1e40af', '#ffffff', '#1d4ed8', '#f472b6', '#ffffff')] },
  eGridCollage: { label: 'Photo collage', render: English.EGridCollage, fonts: [['bricolage', 'dmSans'], ['fraunces', 'interTight'], ['syne', 'dmSans']], palettes: [
    pal('#fffaf3', '#f3e9dc', '#1f1a17', '#e2563b', '#1f1a17', '#ffffff'), pal('#f4f7f5', '#e3ece6', '#14261c', '#2f855a', '#14261c', '#ffffff'), pal('#111111', '#1d1d1d', '#f5f5f5', '#f5c542', '#f5f5f5', '#111111'), pal('#f6f1ff', '#e8defd', '#24124a', '#7c3aed', '#24124a', '#ffffff')] },
  eSaleBurst: { label: 'Loud sale', render: English.ESaleBurst, fonts: [['anton', 'poppins'], ['archivo', 'montserrat'], ['bebas', 'dmSans']], palettes: [
    pal('#ffd84d', '#f5c400', '#111111', '#ff3b3b', '#111111', '#ffffff'), pal('#ff5c8a', '#f0467a', '#111111', '#ffe14d', '#111111', '#111111'), pal('#3ddc97', '#2fc584', '#111111', '#111111', '#111111', '#ffffff'), pal('#5ab9ff', '#43a6f0', '#111111', '#ffde3b', '#111111', '#111111')] },
  eWish: { label: 'Festive wish', render: English.EWish, fonts: [['playfair', 'poppins'], ['dmSerif', 'outfit'], ['fraunces', 'dmSans']], palettes: [
    pal('#fff8ef', '#ffe7c2', '#2a1d12', '#e8890c', '#d6336c', '#ffffff'), pal('#f3f6ff', '#dbe6ff', '#16213e', '#4c6ef5', '#f59f00', '#ffffff'), pal('#fff4f6', '#ffd6de', '#3a1020', '#e64980', '#f59f00', '#ffffff'), pal('#f1fbf5', '#cdeedb', '#10301f', '#2f9e44', '#e67700', '#ffffff')] },
  eCountdown: { label: 'Coming soon', render: English.ECountdown, fonts: [['unbounded', 'interTight'], ['anton', 'dmSans'], ['syne', 'spaceGrotesk']], palettes: [
    pal('#0b0b10', '#17171f', '#ffffff', '#ffcf33', '#ffffff', '#0b0b10'), pal('#0a1620', '#11222f', '#ffffff', '#2ee6c9', '#ffffff', '#0a1620'), pal('#160a1a', '#241029', '#ffffff', '#ff6ad5', '#ffffff', '#160a1a'), pal('#f5f5f0', '#e8e8e0', '#111111', '#ff4d2e', '#111111', '#ffffff')] },
  eProductCard: { label: 'Product card', render: English.EProductCard, fonts: [['bricolage', 'dmSans'], ['sora', 'dmSans'], ['outfit', 'interTight']], palettes: [
    pal('#f8fafc', '#e2e8f0', '#0f172a', '#2563eb', '#0f172a', '#ffffff'), pal('#fff7ed', '#fde2c4', '#1c1917', '#ea580c', '#1c1917', '#ffffff'), pal('#fdf2f8', '#fbcfe8', '#3b0a24', '#db2777', '#3b0a24', '#ffffff'), pal('#f0fdf4', '#c6f0d6', '#052e16', '#16a34a', '#052e16', '#ffffff')] },
  eMinimalPhoto: { label: 'Minimal photo', render: English.EMinimalPhoto, fonts: [['instrument', 'dmSans'], ['fraunces', 'interTight'], ['cormorant', 'montserrat']], palettes: [
    pal('#111111', '#222222', '#ffffff', '#ffffff', '#ffffff', '#111111')] },
};

export const MODERN_LAYOUTS = {
  bento: { label: 'Bento grid', render: Modern.Bento },
  glass: { label: 'Glassmorphism', render: Modern.Glass },
  brutal: { label: 'Neo brutalism', render: Modern.Brutal },
  kinetic: { label: 'Kinetic type', render: Modern.Kinetic },
  swiss: { label: 'Swiss grid', render: Modern.Swiss },
  grain: { label: 'Grain gradient', render: Modern.Grain },
  chrome: { label: 'Y2K chrome', render: Modern.Chrome },
  duotone: { label: 'Duotone', render: Modern.Duotone },
  stickers: { label: 'Sticker collage', render: Modern.Stickers },
  archMinimal: { label: 'Minimal arch', render: Modern.ArchMinimal },
} satisfies Record<string, { label: string; render: (L: LayoutProps) => ReactNode }>;

const CLASSIC_LAYOUTS = {
  hero: { label: 'Photo top', render: Classic.Hero },
  frame: { label: 'Festive frame', render: Classic.Frame },
  split: { label: 'Diagonal split', render: Classic.Split },
  circle: { label: 'Circle spotlight', render: Classic.Circle },
  ribbon: { label: 'Ribbon sale', render: Classic.Ribbon },
  kasavu: { label: 'Kerala kasavu', render: Classic.Kasavu },
  bold: { label: 'Big & bold', render: Classic.Bold },
  card: { label: 'Centre card', render: Classic.Card },
  tribute: { label: 'Portrait tribute', render: Classic.Tribute },
  magazine: { label: 'Magazine', render: Classic.Magazine },
  menu: { label: 'Menu / price list', render: Classic.Menu },
  polaroid: { label: 'Polaroid', render: Classic.Polaroid },
};

export type LayoutFamily = 'kerala' | 'english' | 'modern' | 'classic';
type LayoutEntry = { label: string; render: (L: LayoutProps) => ReactNode; family: LayoutFamily };

export const FAMILY_LABELS: Record<LayoutFamily, string> = { kerala: 'Creative ads', english: 'English posters', modern: 'Modern & trending', classic: 'Classic' };

/** Every layout: creative and Kerala ads first (one family), then English, modern and classic. */
export const LAYOUTS = {
  ...Object.fromEntries(Object.entries(CREATIVE_LAYOUTS).map(([k, v]) => [k, { label: v.label, render: v.render, family: 'kerala' }])),
  ...Object.fromEntries(Object.entries(KERALA_LAYOUTS).map(([k, v]) => [k, { label: v.label, render: v.render, family: 'kerala' }])),
  ...Object.fromEntries(Object.entries(ENGLISH_LAYOUTS).map(([k, v]) => [k, { label: v.label, render: v.render, family: 'english' }])),
  ...Object.fromEntries(Object.entries(MODERN_LAYOUTS).map(([k, v]) => [k, { ...v, family: 'modern' }])),
  ...Object.fromEntries(Object.entries(CLASSIC_LAYOUTS).map(([k, v]) => [k, { ...v, family: 'classic' }])),
} as Record<LayoutKey, LayoutEntry>;
