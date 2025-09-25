export type View = 'gestation' | 'bishop' | 'ultrasound';

export type CalendarType = 'GC' | 'EC';

export interface Milestone {
  name: string;
  date: string;
  ga: string;
}

export interface AncVisit {
  visit: string;
  gaRange: string;
  recommendedDate: string;
  details: string[];
}

export interface BishopScoreParams {
  dilation: number;
  effacement: number;
  station: number;
  consistency: number;
  position: number;
}
