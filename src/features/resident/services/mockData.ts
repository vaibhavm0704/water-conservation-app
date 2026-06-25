// ============================================================
// AquaEstate — Resident Mock Data
// ============================================================

import {
  ResidentDashboard,
  DailyUsage,
  MonthlyUsage,
  Bill,
  Complaint,
  ConservationTip,
  UsageStatistics,
} from '../types/residentTypes';

// ── Dashboard ────────────────────────────────────────────────
export const mockDashboard: ResidentDashboard = {
  todayUsage: 85,
  monthlyUsage: 2450,
  currentBill: 1230,
  openComplaints: 2,
  waterSaved: 1850,
  conservationScore: 91,
};

// ── Hourly usage for each day of the week ────────────────────
const generateHourlyUsage = (seed: number): DailyUsage[] => {
  const hours: DailyUsage[] = [];
  for (let h = 0; h < 24; h++) {
    let usage = 0;
    if (h >= 6 && h <= 8) usage = 8 + Math.round(Math.sin(h + seed) * 4);
    else if (h >= 11 && h <= 13) usage = 6 + Math.round(Math.cos(h + seed) * 3);
    else if (h >= 18 && h <= 21) usage = 7 + Math.round(Math.sin(h + seed) * 3);
    else if (h >= 1 && h <= 5) usage = 0;
    else usage = 2 + Math.round(Math.abs(Math.sin(h + seed)) * 2);
    hours.push({ hour: h, usage: Math.max(usage, 0) });
  }
  return hours;
};

export const mockHourlyByDay: Record<string, DailyUsage[]> = {
  Monday: generateHourlyUsage(1),
  Tuesday: generateHourlyUsage(2),
  Wednesday: generateHourlyUsage(3),
  Thursday: generateHourlyUsage(4),
  Friday: generateHourlyUsage(5),
  Saturday: generateHourlyUsage(6),
  Sunday: generateHourlyUsage(7),
};

// ── Daily usage (7 days) ─────────────────────────────────────
export const weeklyLabels: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const weeklyData: number[] = [82, 95, 78, 110, 85, 72, 88];

// ── Monthly usage (6 months) with targets ────────────────────
export const mockMonthlyUsage: MonthlyUsage[] = [
  { month: 'Jan', usage: 2800, target: 3000 },
  { month: 'Feb', usage: 2650, target: 3000 },
  { month: 'Mar', usage: 2900, target: 3000 },
  { month: 'Apr', usage: 2450, target: 3000 },
  { month: 'May', usage: 2700, target: 3000 },
  { month: 'Jun', usage: 2550, target: 3000 },
];

// ── Statistics ───────────────────────────────────────────────
export const mockStatistics: UsageStatistics = {
  averageUsage: 87,
  highestDay: 'Wednesday',
  highestUsage: 110,
  lowestDay: 'Saturday',
  lowestUsage: 72,
};

// ── Bills ────────────────────────────────────────────────────
export const mockBills: Bill[] = [
  {
    id: 'bill-001',
    month: 'April',
    year: 2026,
    amount: 1230,
    dueDate: '2026-05-10',
    status: 'pending',
    usage: 2450,
  },
  {
    id: 'bill-002',
    month: 'March',
    year: 2026,
    amount: 1150,
    dueDate: '2026-04-10',
    status: 'paid',
    usage: 2900,
  },
  {
    id: 'bill-003',
    month: 'February',
    year: 2026,
    amount: 1340,
    dueDate: '2026-03-10',
    status: 'paid',
    usage: 2650,
  },
];

// ── Complaints ───────────────────────────────────────────────
export const mockComplaints: Complaint[] = [
  {
    id: 'cmp-001',
    ticketId: 'TKT-2026-0041',
    issueType: 'Leakage',
    description: 'Water leaking from the kitchen tap even after shutting it completely.',
    date: '2026-06-24',
    status: 'open',
  },
  {
    id: 'cmp-002',
    ticketId: 'TKT-2026-0039',
    issueType: 'Low Pressure',
    description: 'Very low water pressure in the bathroom shower during morning hours.',
    date: '2026-06-20',
    status: 'in-progress',
  },
  {
    id: 'cmp-003',
    ticketId: 'TKT-2026-0032',
    issueType: 'No Water',
    description: 'No water supply on the 4th floor between 9 AM and 12 PM.',
    date: '2026-06-15',
    status: 'resolved',
  },
  {
    id: 'cmp-004',
    ticketId: 'TKT-2026-0028',
    issueType: 'Dirty Water',
    description: 'Brownish water coming from taps after maintenance work yesterday.',
    date: '2026-06-10',
    status: 'closed',
  },
];

// ── Conservation Tips ────────────────────────────────────────
export const mockConservationTips: ConservationTip[] = [
  {
    id: 'tip-01',
    title: 'Turn Off While Brushing',
    description: 'Save up to 8 litres per minute by turning off the tap while brushing your teeth.',
    icon: 'water-outline',
  },
  {
    id: 'tip-02',
    title: 'Reuse RO Wastewater',
    description: 'Collect RO reject water and use it for mopping floors or watering plants.',
    icon: 'leaf-outline',
  },
  {
    id: 'tip-03',
    title: 'Fix Leaking Faucets',
    description: 'A single dripping tap can waste over 20 litres per day. Get it fixed today!',
    icon: 'build-outline',
  },
  {
    id: 'tip-04',
    title: 'Shorter Showers',
    description: 'Cutting your shower by 2 minutes can save up to 20 litres each time.',
    icon: 'timer-outline',
  },
  {
    id: 'tip-05',
    title: 'Full Load Washing',
    description: 'Run washing machines and dishwashers only with full loads to maximise efficiency.',
    icon: 'shirt-outline',
  },
  {
    id: 'tip-06',
    title: 'Bucket vs Shower',
    description: 'Using a bucket for bathing saves 60–80 litres compared to a 10-minute shower.',
    icon: 'water',
  },
];
