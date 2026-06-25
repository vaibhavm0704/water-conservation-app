// Estate Admin Module - Type Definitions

export interface Resident {
  id: string;
  name: string;
  email: string;
  phone: string;
  flatNumber: string;
  blockName: string;
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  joinDate: string;
}

export interface Block {
  id: string;
  name: string;
  totalFlats: number;
  totalResidents: number;
  description: string;
}

export interface Flat {
  id: string;
  flatNumber: string;
  blockId: string;
  blockName: string;
  ownerName: string;
  occupancyStatus: 'occupied' | 'vacant' | 'maintenance';
  area: number; // in sq. ft.
}

export interface DashboardStats {
  totalResidents: number;
  totalBlocks: number;
  monthlyWaterUsage: number; // in liters
  openComplaints: number;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'resident' | 'complaint' | 'water' | 'maintenance' | 'notice';
}

export interface Report {
  period: string;
  waterUsage: number;
  savings: number;
  complaints: number;
}

export interface WeeklyUsageData {
  labels: string[];
  data: number[];
}

export interface MonthlyComparisonData {
  labels: string[];
  datasets: number[][];
}

export interface ComplaintCategoryData {
  name: string;
  value: number;
  color: string;
}
