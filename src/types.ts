export interface Shortcut {
  id: string;
  title: string;
  url: string;
  iconUrl?: string;
  customIconUrl?: string;
  type?: 'image' | 'text';
  text?: string;
  fontFamily?: string;
  color?: string;
  imageScale?: 'sm' | 'md' | 'lg' | 'fill';
}
