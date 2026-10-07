export type ViewportMode = 'responsive' | 'desktop' | 'laptop' | 'tablet' | 'mobile';

export type ActiveTab = 'runner' | 'design' | 'code' | 'compare';

export interface ColorToken {
  name: string;
  value: string;
  variable?: string;
  usage?: string;
}

export interface TypographyToken {
  name: string;
  fontFamily: string;
  size: string;
  weight: string;
  lineHeight: string;
  sampleText: string;
}

export interface ParsedDesignSystem {
  title: string;
  version: string;
  summary: string;
  colors: ColorToken[];
  typography: TypographyToken[];
  spacing: { name: string; value: string }[];
  principles: string[];
  components: { name: string; description: string; notes?: string }[];
  rawMarkdown: string;
}

export interface StitchProject {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  date: string;
  htmlCode: string;
  designMd: string;
  screenImage?: string; // Data URL or placeholder
  tokens: ParsedDesignSystem;
  isUserUploaded?: boolean;
}
