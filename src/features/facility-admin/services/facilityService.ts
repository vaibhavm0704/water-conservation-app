import {
  Complaint,
  WaterNotice,
  FacilityDashboardStats,
  Staff,
  ComplaintDistribution,
  ComplaintStatus,
  CreateNoticePayload,
} from '../types/facilityTypes';
import {
  MOCK_COMPLAINTS,
  MOCK_NOTICES,
  MOCK_DASHBOARD_STATS,
  MOCK_STAFF,
  MOCK_COMPLAINT_DISTRIBUTION,
} from './mockData';

// Simulate network delay
const delay = (ms: number = 600): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// In-memory copies for mutation
let complaints = [...MOCK_COMPLAINTS];
let notices = [...MOCK_NOTICES];

/**
 * Get dashboard statistics
 * TODO: Replace with FastAPI GET /api/facility/dashboard/stats
 */
export const getDashboardStats = async (): Promise<FacilityDashboardStats> => {
  await delay();
  return { ...MOCK_DASHBOARD_STATS };
};

/**
 * Get complaint distribution data
 * TODO: Replace with FastAPI GET /api/facility/complaints/distribution
 */
export const getComplaintDistribution = async (): Promise<ComplaintDistribution[]> => {
  await delay(300);
  return [...MOCK_COMPLAINT_DISTRIBUTION];
};

/**
 * Get all complaints, optionally filtered by status
 * TODO: Replace with FastAPI GET /api/facility/complaints?status={filter}
 */
export const getComplaints = async (filter?: ComplaintStatus): Promise<Complaint[]> => {
  await delay();
  if (filter) {
    return complaints.filter((c) => c.status === filter);
  }
  return [...complaints];
};

/**
 * Get a single complaint by ID
 * TODO: Replace with FastAPI GET /api/facility/complaints/{id}
 */
export const getComplaintById = async (id: string): Promise<Complaint | null> => {
  await delay(400);
  const complaint = complaints.find((c) => c.id === id);
  return complaint ? { ...complaint } : null;
};

/**
 * Assign a staff member to a complaint
 * TODO: Replace with FastAPI PATCH /api/facility/complaints/{id}/assign
 */
export const assignComplaint = async (id: string, staffId: string): Promise<Complaint> => {
  await delay(500);
  complaints = complaints.map((c) =>
    c.id === id ? { ...c, assignedStaff: staffId, status: 'in_progress' as const } : c
  );
  const updated = complaints.find((c) => c.id === id);
  if (!updated) throw new Error('Complaint not found');
  return { ...updated };
};

/**
 * Resolve a complaint with notes
 * TODO: Replace with FastAPI PATCH /api/facility/complaints/{id}/resolve
 */
export const resolveComplaint = async (id: string, notes: string): Promise<Complaint> => {
  await delay(500);
  complaints = complaints.map((c) =>
    c.id === id ? { ...c, status: 'resolved' as const, resolutionNotes: notes } : c
  );
  const updated = complaints.find((c) => c.id === id);
  if (!updated) throw new Error('Complaint not found');
  return { ...updated };
};

/**
 * Get all water notices
 * TODO: Replace with FastAPI GET /api/facility/notices
 */
export const getNotices = async (): Promise<WaterNotice[]> => {
  await delay();
  return [...notices];
};

/**
 * Create a new water notice
 * TODO: Replace with FastAPI POST /api/facility/notices
 */
export const createNotice = async (data: CreateNoticePayload): Promise<WaterNotice> => {
  await delay(700);
  const newNotice: WaterNotice = {
    id: `n-${Date.now()}`,
    title: data.title,
    description: data.description,
    type: data.type,
    startTime: data.startTime,
    endTime: data.endTime,
    createdBy: 'Rajesh Kumar',
    createdAt: new Date().toISOString().split('T')[0],
    status: 'scheduled',
  };
  notices = [newNotice, ...notices];
  return { ...newNotice };
};

/**
 * Get all staff members
 * TODO: Replace with FastAPI GET /api/facility/staff
 */
export const getStaff = async (): Promise<Staff[]> => {
  await delay(400);
  return [...MOCK_STAFF];
};
