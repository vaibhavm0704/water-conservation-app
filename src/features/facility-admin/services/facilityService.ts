// ============================================================
// AquaEstate — Facility Admin Service (reads/writes shared store)
// ============================================================

import {
  SharedComplaint,
  ComplaintStatus,
  ComplaintDistribution,
  WaterNotice,
  Staff,
  NoticeType,
  getAllComplaints,
  getComplaintsByStatus,
  getComplaintById as storeGetById,
  assignComplaintToStaff,
  resolveComplaintById,
  getAllNotices,
  createNewNotice,
  getAllStaff,
  getFacilityDashboardStats,
  computeComplaintDistribution,
} from '../../../shared/data/sharedStore';

const delay = (ms: number = 400): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ── Dashboard ────────────────────────────────────────────────

export const getDashboardStats = async () => {
  await delay(300);
  return getFacilityDashboardStats();
};

export const getComplaintDistribution = async (): Promise<ComplaintDistribution[]> => {
  await delay(200);
  return computeComplaintDistribution();
};

// ── Complaints ───────────────────────────────────────────────

export const getComplaints = async (filter?: ComplaintStatus): Promise<SharedComplaint[]> => {
  await delay(400);
  return getComplaintsByStatus(filter);
};

export const getComplaintById = async (id: string): Promise<SharedComplaint | null> => {
  await delay(300);
  return storeGetById(id);
};

export const assignComplaint = async (id: string, staffId: string): Promise<SharedComplaint> => {
  await delay(400);
  return assignComplaintToStaff(id, staffId);
};

export const resolveComplaint = async (id: string, notes: string): Promise<SharedComplaint> => {
  await delay(400);
  return resolveComplaintById(id, notes);
};

// ── Notices ──────────────────────────────────────────────────

export const getNotices = async (): Promise<WaterNotice[]> => {
  await delay(400);
  return getAllNotices();
};

export const createNotice = async (data: {
  title: string;
  description: string;
  type: NoticeType;
  startTime: string;
  endTime: string;
  createdBy: string;
}): Promise<WaterNotice> => {
  await delay(500);
  return createNewNotice(data);
};

// ── Staff ────────────────────────────────────────────────────

export const getStaff = async (): Promise<Staff[]> => {
  await delay(300);
  return getAllStaff();
};
