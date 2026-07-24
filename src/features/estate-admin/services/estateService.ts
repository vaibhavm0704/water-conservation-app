// ============================================================
// AquaEstate — Estate Admin Service (reads/writes shared store)
// ============================================================

import {
  Resident,
  Block,
  Flat,
  Activity,
  getAllResidents,
  searchResidentsByQuery,
  addNewResident,
  updateResidentById,
  removeResidentById,
  getAllBlocks,
  getAllFlats,
  getActivities,
  getEstateDashboardStats,
} from '../../../shared/data/sharedStore';

import type {
  DashboardStats,
  WeeklyUsageData,
  MonthlyComparisonData,
  ComplaintCategoryData,
  Report,
} from '../types/estateTypes';

import {
  mockWeeklyUsage,
  mockMonthlyComparison,
  mockComplaintCategories,
} from './mockData';

const delay = (ms: number = 300): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ── Dashboard ──────────────────────────────────────────────

export const getDashboardStats = async (): Promise<DashboardStats> => {
  await delay();
  return getEstateDashboardStats();
};

export const getRecentActivities = async (): Promise<Activity[]> => {
  await delay();
  return getActivities().slice(0, 5);
};

// ── Residents ──────────────────────────────────────────────

export const getResidents = async (): Promise<Resident[]> => {
  await delay();
  return getAllResidents();
};

export const searchResidents = async (query: string): Promise<Resident[]> => {
  await delay();
  return searchResidentsByQuery(query);
};

export const addResident = async (data: Omit<Resident, 'id'>): Promise<Resident> => {
  await delay();
  return addNewResident(data);
};

export const updateResident = async (id: string, data: Partial<Resident>): Promise<Resident> => {
  await delay();
  return updateResidentById(id, data);
};

export const removeResident = async (id: string): Promise<boolean> => {
  await delay();
  return removeResidentById(id);
};

// ── Blocks & Flats ─────────────────────────────────────────

export const getBlocks = async (): Promise<Block[]> => {
  await delay();
  return getAllBlocks();
};

export const getFlats = async (blockId?: string): Promise<Flat[]> => {
  await delay();
  return getAllFlats(blockId);
};

// ── Charts / Analytics (stays mock) ────────────────────────

export const getWeeklyUsage = async (): Promise<WeeklyUsageData> => {
  await delay();
  return mockWeeklyUsage;
};

export const getMonthlyComparison = async (): Promise<MonthlyComparisonData> => {
  await delay();
  return mockMonthlyComparison;
};

export const getComplaintCategories = async (): Promise<ComplaintCategoryData[]> => {
  await delay();
  return mockComplaintCategories;
};

// ── Reports (stays mock) ──────────────────────────────────

export const getReports = async (
  filter: 'daily' | 'weekly' | 'monthly' | 'yearly',
): Promise<Report[]> => {
  await delay();
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
