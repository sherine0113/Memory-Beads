export type AppStep = 'landing' | 'create' | 'generating' | 'result' | 'share';

export type StyleType = 'spring' | 'dopamine' | 'retro' | 'clear' | 'mono';
export type DensityType = 'light' | 'standard' | 'hd';

export interface StyleOption {
  key: StyleType;
  label: string;
  desc: string;
  emoji: string;
  colors: [string, string];
}

export interface DensityOption {
  key: DensityType;
  label: string;
  desc: string;
  grid: string;
  icon: string;
}

export interface GenerateParams {
  mainImage: string;
  tileImages: string[];
  style: StyleType;
  density: DensityType;
}
