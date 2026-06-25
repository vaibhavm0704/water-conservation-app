// Facility Admin Module Types

export type ComplaintCategory = 'leakage' | 'no_water' | 'low_pressure' | 'dirty_water' | 'other';

export type ComplaintStatus = 'pending' | 'in_progress' | 'resolved';

export type ComplaintPriority = 'high' | 'medium' | 'low';

export type NoticeType = 'shutdown' | 'cleaning' | 'repair' | 'testing' | 'emergency';

export type NoticeStatus = 'active' | 'scheduled' | 'completed' | 'cancelled';

export interface Complaint {
  id: string;
  ticketId: string;
  residentName: string;
  flatNumber: string;
  issueType: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  description: string;
  date: string;
  assignedStaff: string | null;
  resolutionNotes: string | null;
  imageUri: string | null;
}

export interface WaterNotice {
  id: string;
  title: string;
  description: string;
  type: NoticeType;
  startTime: string;
  endTime: string;
  createdBy: string;
  createdAt: string;
  status: NoticeStatus;
}

export interface FacilityDashboardStats {
  pendingComplaints: number;
  resolvedIssues: number;
  waterUsage: number;
  scheduledMaintenance: number;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  phone: string;
  available: boolean;
}

export interface ComplaintDistribution {
  category: ComplaintCategory;
  label: string;
  percentage: number;
  color: string;
}

export interface CreateNoticePayload {
  title: string;
  description: string;
  type: NoticeType;
  startTime: string;
  endTime: string;
}
