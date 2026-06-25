// Estate Admin Module - Service Layer
// TODO: Replace all mock implementations with actual FastAPI endpoints

import {
  Resident,
  Block,
  Flat,
  DashboardStats,
  Activity,
  Report,
  WeeklyUsageData,
  MonthlyComparisonData,
  ComplaintCategoryData,
} from '../types/estateTypes';
import {
  mockResidents,
  mockBlocks,
  mockFlats,
  mockDashboardStats,
  mockActivities,
  mockWeeklyUsage,
  mockMonthlyComparison,
  mockComplaintCategories,
} from './mockData';

const delay = (ms: number = 300) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

// ── Dashboard ──────────────────────────────────────────────────────────

/** TODO: GET /api/estate/dashboard/stats */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  await delay();
  return mockDashboardStats;
};

/** TODO: GET /api/estate/activities?limit=5 */
export const getRecentActivities = async (): Promise<Activity[]> => {
  await delay();
  return mockActivities;
};

// ── Residents ──────────────────────────────────────────────────────────

/** TODO: GET /api/estate/residents */
export const getResidents = async (): Promise<Resident[]> => {
  await delay();
  return mockResidents;
};

/** TODO: GET /api/estate/residents?search={query} */
export const searchResidents = async (query: string): Promise<Resident[]> => {
  await delay();
  const q = query.toLowerCase();
  return mockResidents.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      r.flatNumber.toLowerCase().includes(q) ||
      r.blockName.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q)
  );
};

/** TODO: POST /api/estate/residents */
export const addResident = async (
  data: Omit<Resident, 'id'>
): Promise<Resident> => {
  await delay();
  const newResident: Resident = {
    ...data,
    id: `r${Date.now()}`,
  };
  // In a real app the backend would persist this
  return newResident;
};

/** TODO: PUT /api/estate/residents/{id} */
export const updateResident = async (
  id: string,
  data: Partial<Resident>
): Promise<Resident> => {
  await delay();
  const existing = mockResidents.find((r) => r.id === id);
  if (!existing) throw new Error('Resident not found');
  return { ...existing, ...data };
};

/** TODO: DELETE /api/estate/residents/{id} */
export const removeResident = async (id: string): Promise<boolean> => {
  await delay();
  return true;
};

// ── Blocks & Flats ─────────────────────────────────────────────────────

/** TODO: GET /api/estate/blocks */
export const getBlocks = async (): Promise<Block[]> => {
  await delay();
  return mockBlocks;
};

/** TODO: GET /api/estate/flats?blockId={blockId} */
export const getFlats = async (blockId?: string): Promise<Flat[]> => {
  await delay();
  if (blockId) {
    return mockFlats.filter((f) => f.blockId === blockId);
  }
  return mockFlats;
};

// ── Charts / Analytics ─────────────────────────────────────────────────

/** TODO: GET /api/estate/analytics/weekly-usage */
export const getWeeklyUsage = async (): Promise<WeeklyUsageData> => {
  await delay();
  return mockWeeklyUsage;
};

/** TODO: GET /api/estate/analytics/monthly-comparison */
export const getMonthlyComparison = async (): Promise<MonthlyComparisonData> => {
  await delay();
  return mockMonthlyComparison;
};

/** TODO: GET /api/estate/analytics/complaint-categories */
export const getComplaintCategories = async (): Promise<ComplaintCategoryData[]> => {
  await delay();
  return mockComplaintCategories;
};

// ── Reports ────────────────────────────────────────────────────────────

/** TODO: GET /api/estate/reports?filter={filter} */
export const getReports = async (
  filter: 'daily' | 'weekly' | 'monthly' | 'yearly'
): Promise<Report[]> => {
  await delay();
  // Mock reports varying by filter
  const multiplier =
    filter === 'daily' ? 1 : filter === 'weekly' ? 7 : filter === 'monthly' ? 30 : 365;

  return [
    {
      period: filter === 'daily' ? 'Today' : filter === 'weekly' ? 'This Week' : filter === 'monthly' ? 'This Month' : 'This Year',
      waterUsage: 1500 * multiplier,
      savings: 200 * multiplier,
      complaints: Math.ceil(2 * (multiplier / 7)),
    },
    {
      period: filter === 'daily' ? 'Yesterday' : filter === 'weekly' ? 'Last Week' : filter === 'monthly' ? 'Last Month' : 'Last Year',
      waterUsage: 1650 * multiplier,
      savings: 180 * multiplier,
      complaints: Math.ceil(3 * (multiplier / 7)),
    },
  ];
};
