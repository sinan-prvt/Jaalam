import type { ReactNode } from 'react';
import * as Kerala from './kerala';
import * as Modern from './modern';
import * as Classic from './classic';
import * as Creative from './creative';
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

export type LayoutFamily = 'kerala' | 'modern' | 'classic';
type LayoutEntry = { label: string; render: (L: LayoutProps) => ReactNode; family: LayoutFamily };

export const FAMILY_LABELS: Record<LayoutFamily, string> = { kerala: 'Creative ads', modern: 'Modern & trending', classic: 'Classic' };

/** Every layout: creative and Kerala ads first (one family), then modern, then classic. */
export const LAYOUTS = {
  ...Object.fromEntries(Object.entries(CREATIVE_LAYOUTS).map(([k, v]) => [k, { label: v.label, render: v.render, family: 'kerala' }])),
  ...Object.fromEntries(Object.entries(KERALA_LAYOUTS).map(([k, v]) => [k, { label: v.label, render: v.render, family: 'kerala' }])),
  ...Object.fromEntries(Object.entries(MODERN_LAYOUTS).map(([k, v]) => [k, { ...v, family: 'modern' }])),
  ...Object.fromEntries(Object.entries(CLASSIC_LAYOUTS).map(([k, v]) => [k, { ...v, family: 'classic' }])),
} as Record<LayoutKey, LayoutEntry>;
