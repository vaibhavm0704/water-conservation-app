// ============================================================
// AquaEstate — Resident Service (reads/writes shared store)
// ============================================================

import {
  SharedComplaint,
  ComplaintCategory,
  getAllComplaints,
  getComplaintsByResident,
  createComplaint,
  getAllNotices,
  getResidentDashboardStats,
  ISSUE_TYPE_LABELS,
} from '../../../shared/data/sharedStore';

import {
  mockHourlyByDay,
  weeklyLabels,
  weeklyData,
  mockMonthlyUsage,
  mockStatistics,
  mockBills,
  mockConservationTips,
} from './mockData';

import type {
  ResidentDashboard,
  DailyUsage,
  MonthlyUsage,
  Bill,
  ConservationTip,
  UsageStatistics,
} from '../types/residentTypes';

const delay = (ms: number = 400): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ── Dashboard ────────────────────────────────────────────────

export const getDashboard = async (residentId: string): Promise<ResidentDashboard> => {
  await delay(300);
  return getResidentDashboardStats(residentId);
};

// ── Usage (stays mock — not cross-role) ──────────────────────

export const getDailyUsage = async (day: string = 'Monday'): Promise<DailyUsage[]> => {
  await delay(300);
  return mockHourlyByDay[day] ?? mockHourlyByDay.Monday;
};

export const getWeeklyUsage = async (): Promise<{ labels: string[]; data: number[] }> => {
  await delay(300);
  return { labels: [...weeklyLabels], data: [...weeklyData] };
};

export const getMonthlyUsage = async (): Promise<MonthlyUsage[]> => {
  await delay(300);
  return [...mockMonthlyUsage];
};

export const getStatistics = async (): Promise<UsageStatistics> => {
  await delay(200);
  return { ...mockStatistics };
};

export const getConservationScore = async (): Promise<number> => {
  await delay(200);
  return 91;
};

// ── Complaints (shared store) ────────────────────────────────

export const getComplaints = async (residentId?: string): Promise<SharedComplaint[]> => {
  await delay(300);
  if (residentId) return getComplaintsByResident(residentId);
  return getAllComplaints();
};

export const raiseComplaint = async (payload: {
  issueType: ComplaintCategory;
  description: string;
  imageUri?: string;
  residentId: string;
  residentName: string;
  flatNumber: string;
}): Promise<SharedComplaint> => {
  await delay(500);
  return createComplaint(payload);
};

// ── Notices (shared store, read-only for residents) ──────────

export const getNotices = async () => {
  await delay(300);
  return getAllNotices();
};

// ── Bills (stays mock) ───────────────────────────────────────

export const getBills = async (): Promise<Bill[]> => {
  await delay(400);
  return [...mockBills];
};

export const downloadBill = async (id: string): Promise<string> => {
  await delay(500);
  return `https://api.aquaestate.com/bills/${id}/download`;
};

// ── Conservation Tips (stays mock) ───────────────────────────

export const getConservationTips = async (): Promise<ConservationTip[]> => {
  await delay(300);
  return [...mockConservationTips];
};
