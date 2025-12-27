
export interface TreeConfig {
  lightIntensity: number;
  rotationSpeed: number;
  glowColor: string;
  ornamentDensity: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export enum ConciergeTone {
  ELEGANT = 'Elegant',
  MYSTICAL = 'Mystical',
  GRAND = 'Grand'
}

export enum TreeMorphStatus {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE'
}
