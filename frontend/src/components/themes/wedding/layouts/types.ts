export interface WeddingLayoutProps {
  content: any;
  website: any;
  updateContent?: (content: any) => void;
  isEditor?: boolean;
  colors: {
    bgClass: string;
    sectionBg: string;
    accentText: string;
    accentBg: string;
    accentHover: string;
    borderClass: string;
    heroOpacity: string;
    heroBg: string;
  };
}
