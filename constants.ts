import type { BishopScoreParams } from './types';

export const NAVIGATION_ITEMS = [
  { id: 'gestation', label: 'Gestation Calculator' },
  { id: 'bishop', label: 'Bishop Score' },
  { id: 'ultrasound', label: 'Fetal Ultrasound' },
];

export const GREGORIAN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const ETHIOPIAN_MONTHS = [
  'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit', 
  'Megabit', 'Miyazya', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagume'
];


export const MILESTONE_WEEKS: { [key: string]: number | [number, number] } = {
  '1st FHR (Doppler)': [10, 12],
  'Routine Anatomic Scan': [18, 22],
  'GA of Viability': 24,
  '2hr OGTT': [24, 28],
  'Anti-D Prophylaxis': 28,
  'Antepartum Fetal Surveillance (High Risk)': 32,
  'Post-term Pregnancy After': 42,
};

export const WHO_ANC_SCHEDULE = [
  { visit: 'First contact', weeks: 12, details: ['Blood group & Rh', 'Hemoglobin (Hb)', 'HIV, Syphilis, Hep B serology', 'Urine test for proteinuria', 'Tetanus-diphtheria (Td) vaccine #1', 'Folic acid & iron supplementation', 'Counseling on nutrition, danger signs'] },
  { visit: 'Second contact', weeks: 20, details: ['Routine anatomic ultrasound scan', 'Symphysial-fundal height (SFH) measurement', 'Review birth plan', 'Follow-up on initial tests'] },
  { visit: 'Third contact', weeks: 26, details: ['Repeat Hb test for anemia', 'Oral Glucose Tolerance Test (OGTT) if indicated', 'SFH measurement', 'Counseling on fetal movements'] },
  { visit: 'Fourth contact', weeks: 30, details: ['SFH measurement', 'Review danger signs', 'Birth and emergency plan preparedness'] },
  { visit: 'Fifth contact', weeks: 34, details: ['SFH measurement', 'Td vaccine #2 (if needed)', 'Counseling on signs of labor and breastfeeding'] },
  { visit: 'Sixth contact', weeks: 36, details: ['Assess fetal presentation and position', 'SFH measurement', 'Review birth plan', 'Counseling on postpartum care'] },
  { visit: 'Seventh contact', weeks: 38, details: ['SFH measurement', 'Assess fetal well-being', 'Finalize birth and emergency plan'] },
  { visit: 'Eighth contact', weeks: 40, details: ['Assess fetal well-being', 'Discuss management of prolonged pregnancy if post-term', 'SFH measurement'] },
];

export const BISHOP_SCORE_OPTIONS: { [key in keyof BishopScoreParams]: { label: string; options: string[] } } = {
  dilation: { label: 'Dilation (cm)', options: ['Closed', '1-2', '3-4', '>=5'] },
  effacement: { label: 'Effacement (%)', options: ['0-30', '40-50', '60-70', '>=80'] },
  station: { label: 'Fetal Station', options: ['-3', '-2', '-1, 0', '+1, +2'] },
  consistency: { label: 'Cervical Consistency', options: ['Firm', 'Medium', 'Soft'] },
  position: { label: 'Cervical Position', options: ['Posterior', 'Mid-position', 'Anterior'] },
};

// Data from WHO Fetal Growth Charts. Values are illustrative.
export const EFW_CHART_DATA = [
  { ga: 20, p5: 280, p50: 330, p95: 390 },
  { ga: 22, p5: 420, p50: 500, p95: 600 },
  { ga: 24, p5: 580, p50: 670, p95: 800 },
  { ga: 26, p5: 750, p50: 890, p95: 1050 },
  { ga: 28, p5: 950, p50: 1150, p95: 1380 },
  { ga: 30, p5: 1200, p50: 1450, p95: 1750 },
  { ga: 32, p5: 1500, p50: 1800, p95: 2200 },
  { ga: 34, p5: 1850, p50: 2250, p95: 2700 },
  { ga: 36, p5: 2200, p50: 2700, p95: 3250 },
  { ga: 38, p5: 2550, p50: 3100, p95: 3750 },
  { ga: 40, p5: 2800, p50: 3450, p95: 4200 },
];

// Data based on Moore and Cayle, 1990. Values are illustrative.
export const AFI_CHART_DATA = [
    { ga: 16, p5: 7.3, p50: 12.1, p95: 18.3 },
    { ga: 20, p5: 8.5, p50: 13.5, p95: 20.0 },
    { ga: 24, p5: 9.5, p50: 14.2, p95: 21.2 },
    { ga: 28, p5: 10.0, p50: 14.5, p95: 22.5 },
    { ga: 32, p5: 9.0, p50: 14.4, p95: 24.0 },
    { ga: 36, p5: 7.8, p50: 13.5, p95: 25.5 },
    { ga: 40, p5: 6.8, p50: 12.5, p95: 24.5 },
    { ga: 42, p5: 5.0, p50: 11.0, p95: 20.0 },
];
