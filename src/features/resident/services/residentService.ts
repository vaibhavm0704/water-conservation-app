// ============================================================
// AquaEstate — Resident Service (Mock / Promise-based)
// ============================================================
// TODO: Replace all mock implementations with FastAPI calls
//       once the backend is available.
// ============================================================

import {
  ResidentDashboard,
  DailyUsage,
  MonthlyUsage,
  Bill,
  Complaint,
  ConservationTip,
  UsageStatistics,
  RaiseComplaintPayload,
} from '../types/residentTypes';

import {
  mockDashboard,
  mockHourlyByDay,
  weeklyLabels,
  weeklyData,
  mockMonthlyUsage,
  mockStatistics,
  mockBills,
  mockComplaints,
  mockConservationTips,
} from './mockData';

// Helper — simulate network latency
const delay = (ms: number = 600): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ── Dashboard ────────────────────────────────────────────────

/** TODO: GET /api/resident/dashboard */
export const getDashboard = async (): Promise<ResidentDashboard> => {
  await delay(500);
  return { ...mockDashboard };
};

// ── Usage ────────────────────────────────────────────────────

/** TODO: GET /api/resident/usage/daily?day={day} */
export const getDailyUsage = async (
  day: string = 'Monday',
): Promise<DailyUsage[]> => {
  await delay(400);
  return mockHourlyByDay[day] ?? mockHourlyByDay.Monday;
};

/** TODO: GET /api/resident/usage/weekly */
export const getWeeklyUsage = async (): Promise<{
  labels: string[];
  data: number[];
}> => {
  await delay(400);
  return { labels: [...weeklyLabels], data: [...weeklyData] };
};

/** TODO: GET /api/resident/usage/monthly */
export const getMonthlyUsage = async (): Promise<MonthlyUsage[]> => {
  await delay(400);
  return [...mockMonthlyUsage];
};

/** TODO: GET /api/resident/usage/statistics */
export const getStatistics = async (): Promise<UsageStatistics> => {
  await delay(300);
  return { ...mockStatistics };
};

/** TODO: GET /api/resident/conservation-score */
export const getConservationScore = async (): Promise<number> => {
  await delay(300);
  return mockDashboard.conservationScore;
};

// ── Complaints ───────────────────────────────────────────────

/** TODO: GET /api/resident/complaints */
export const getComplaints = async (): Promise<Complaint[]> => {
  await delay(500);
  return [...mockComplaints];
};

/** TODO: POST /api/resident/complaints */
export const raiseComplaint = async (
  payload: RaiseComplaintPayload,
): Promise<Complaint> => {
  await delay(800);
  const newComplaint: Complaint = {
    id: `cmp-${Date.now()}`,
    ticketId: `TKT-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    issueType: payload.issueType,
    description: payload.description,
    date: new Date().toISOString().split('T')[0],
    status: 'open',
    imageUri: payload.imageUri,
  };
  return newComplaint;
};

// ── Bills ────────────────────────────────────────────────────

/** TODO: GET /api/resident/bills */
export const getBills = async (): Promise<Bill[]> => {
  await delay(500);
  return [...mockBills];
};

/** TODO: GET /api/resident/bills/{id}/download */
export const downloadBill = async (id: string): Promise<string> => {
  await delay(700);
  // In production this would return a presigned URL or trigger a download
  return `https://api.aquaestate.com/bills/${id}/download`;
};

// ── Conservation Tips ────────────────────────────────────────

/** TODO: GET /api/resident/conservation-tips */
export const getConservationTips = async (): Promise<ConservationTip[]> => {
  await delay(400);
  return [...mockConservationTips];
};
