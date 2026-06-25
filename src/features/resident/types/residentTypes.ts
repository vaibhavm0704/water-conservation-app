// ============================================================
// AquaEstate — Resident Module Types
// ============================================================

/** A single water-usage reading for a specific date. */
export interface WaterUsage {
  date: string; // ISO-8601 or display date
  usage: number; // liters
  comparison: number; // liters from previous period
}

/** Hourly usage snapshot (0–23h). */
export interface DailyUsage {
  hour: number;
  usage: number; // liters
}

/** Monthly usage with a conservation target. */
export interface MonthlyUsage {
  month: string;
  usage: number; // liters
  target: number; // liters
}

/** Aggregated dashboard metrics shown on the home screen. */
export interface ResidentDashboard {
  todayUsage: number; // liters
  monthlyUsage: number; // liters
  currentBill: number; // ₹
  openComplaints: number;
  waterSaved: number; // liters
  conservationScore: number; // 0–100
}

/** Water bill. */
export interface Bill {
  id: string;
  month: string;
  year: number;
  amount: number; // ₹
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  usage: number; // liters
}

/** Resident complaint / service request. */
export type ComplaintStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
export type IssueType =
  | 'Leakage'
  | 'No Water'
  | 'Low Pressure'
  | 'Dirty Water'
  | 'Others';

export interface Complaint {
  id: string;
  ticketId: string;
  issueType: IssueType;
  description: string;
  date: string;
  status: ComplaintStatus;
  imageUri?: string;
}

/** Water conservation tip. */
export interface ConservationTip {
  id: string;
  title: string;
  description: string;
  icon: string; // Ionicons / MaterialCommunityIcons name
}

/** Statistics summary (derived from daily data). */
export interface UsageStatistics {
  averageUsage: number; // L/day
  highestDay: string;
  highestUsage: number;
  lowestDay: string;
  lowestUsage: number;
}

/** Payload sent when raising a new complaint. */
export interface RaiseComplaintPayload {
  issueType: IssueType;
  description: string;
  imageUri?: string;
}
