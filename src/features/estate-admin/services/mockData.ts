// Estate Admin Module - Mock Data
// Realistic Indian estate management data

import {
  Resident,
  Block,
  Flat,
  DashboardStats,
  Activity,
  WeeklyUsageData,
  MonthlyComparisonData,
  ComplaintCategoryData,
} from '../types/estateTypes';

// ── Residents ──────────────────────────────────────────────────────────

export const mockResidents: Resident[] = [
  {
    id: 'r1',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@email.com',
    phone: '+91 98765 43210',
    flatNumber: 'A-101',
    blockName: 'Block A - Riverside',
    status: 'active',
    joinDate: '2023-03-15',
  },
  {
    id: 'r2',
    name: 'Priya Patel',
    email: 'priya.patel@email.com',
    phone: '+91 87654 32109',
    flatNumber: 'A-203',
    blockName: 'Block A - Riverside',
    status: 'active',
    joinDate: '2023-06-20',
  },
  {
    id: 'r3',
    name: 'Amit Kumar',
    email: 'amit.kumar@email.com',
    phone: '+91 76543 21098',
    flatNumber: 'B-102',
    blockName: 'Block B - Lakeview',
    status: 'active',
    joinDate: '2023-01-10',
  },
  {
    id: 'r4',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@email.com',
    phone: '+91 65432 10987',
    flatNumber: 'B-205',
    blockName: 'Block B - Lakeview',
    status: 'active',
    joinDate: '2023-08-05',
  },
  {
    id: 'r5',
    name: 'Vikram Singh',
    email: 'vikram.singh@email.com',
    phone: '+91 54321 09876',
    flatNumber: 'C-301',
    blockName: 'Block C - Fountain Court',
    status: 'pending',
    joinDate: '2024-01-22',
  },
  {
    id: 'r6',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@email.com',
    phone: '+91 43210 98765',
    flatNumber: 'C-102',
    blockName: 'Block C - Fountain Court',
    status: 'active',
    joinDate: '2023-04-18',
  },
  {
    id: 'r7',
    name: 'Rahul Mehta',
    email: 'rahul.mehta@email.com',
    phone: '+91 32109 87654',
    flatNumber: 'D-401',
    blockName: 'Block D - Raindrop Tower',
    status: 'active',
    joinDate: '2023-07-12',
  },
  {
    id: 'r8',
    name: 'Kavitha Nair',
    email: 'kavitha.nair@email.com',
    phone: '+91 21098 76543',
    flatNumber: 'D-203',
    blockName: 'Block D - Raindrop Tower',
    status: 'inactive',
    joinDate: '2022-11-30',
  },
  {
    id: 'r9',
    name: 'Deepak Verma',
    email: 'deepak.verma@email.com',
    phone: '+91 90876 54321',
    flatNumber: 'A-305',
    blockName: 'Block A - Riverside',
    status: 'active',
    joinDate: '2023-09-01',
  },
  {
    id: 'r10',
    name: 'Meera Joshi',
    email: 'meera.joshi@email.com',
    phone: '+91 80987 65432',
    flatNumber: 'B-401',
    blockName: 'Block B - Lakeview',
    status: 'active',
    joinDate: '2024-02-14',
  },
  {
    id: 'r11',
    name: 'Arjun Desai',
    email: 'arjun.desai@email.com',
    phone: '+91 70123 45678',
    flatNumber: 'C-204',
    blockName: 'Block C - Fountain Court',
    status: 'pending',
    joinDate: '2024-03-10',
  },
  {
    id: 'r12',
    name: 'Sunita Gupta',
    email: 'sunita.gupta@email.com',
    phone: '+91 60234 56789',
    flatNumber: 'D-104',
    blockName: 'Block D - Raindrop Tower',
    status: 'active',
    joinDate: '2023-05-25',
  },
];

// ── Blocks ─────────────────────────────────────────────────────────────

export const mockBlocks: Block[] = [
  {
    id: 'b1',
    name: 'Block A - Riverside',
    totalFlats: 48,
    totalResidents: 42,
    description: 'Premium riverside apartments with garden view',
  },
  {
    id: 'b2',
    name: 'Block B - Lakeview',
    totalFlats: 40,
    totalResidents: 38,
    description: 'Lake-facing units with modern amenities',
  },
  {
    id: 'b3',
    name: 'Block C - Fountain Court',
    totalFlats: 36,
    totalResidents: 34,
    description: 'Central courtyard with fountain feature',
  },
  {
    id: 'b4',
    name: 'Block D - Raindrop Tower',
    totalFlats: 44,
    totalResidents: 42,
    description: 'Tallest tower with panoramic views',
  },
];

// ── Flats ──────────────────────────────────────────────────────────────

export const mockFlats: Flat[] = [
  { id: 'f1', flatNumber: 'A-101', blockId: 'b1', blockName: 'Block A - Riverside', ownerName: 'Rajesh Sharma', occupancyStatus: 'occupied', area: 1250 },
  { id: 'f2', flatNumber: 'A-102', blockId: 'b1', blockName: 'Block A - Riverside', ownerName: 'Neha Kapoor', occupancyStatus: 'occupied', area: 1100 },
  { id: 'f3', flatNumber: 'A-203', blockId: 'b1', blockName: 'Block A - Riverside', ownerName: 'Priya Patel', occupancyStatus: 'occupied', area: 1350 },
  { id: 'f4', flatNumber: 'A-305', blockId: 'b1', blockName: 'Block A - Riverside', ownerName: 'Deepak Verma', occupancyStatus: 'occupied', area: 1450 },
  { id: 'f5', flatNumber: 'B-102', blockId: 'b2', blockName: 'Block B - Lakeview', ownerName: 'Amit Kumar', occupancyStatus: 'occupied', area: 1200 },
  { id: 'f6', flatNumber: 'B-205', blockId: 'b2', blockName: 'Block B - Lakeview', ownerName: 'Sneha Reddy', occupancyStatus: 'occupied', area: 1300 },
  { id: 'f7', flatNumber: 'B-301', blockId: 'b2', blockName: 'Block B - Lakeview', ownerName: '', occupancyStatus: 'vacant', area: 1150 },
  { id: 'f8', flatNumber: 'B-401', blockId: 'b2', blockName: 'Block B - Lakeview', ownerName: 'Meera Joshi', occupancyStatus: 'occupied', area: 1500 },
  { id: 'f9', flatNumber: 'C-102', blockId: 'b3', blockName: 'Block C - Fountain Court', ownerName: 'Ananya Iyer', occupancyStatus: 'occupied', area: 1100 },
  { id: 'f10', flatNumber: 'C-204', blockId: 'b3', blockName: 'Block C - Fountain Court', ownerName: 'Arjun Desai', occupancyStatus: 'occupied', area: 1250 },
  { id: 'f11', flatNumber: 'C-301', blockId: 'b3', blockName: 'Block C - Fountain Court', ownerName: 'Vikram Singh', occupancyStatus: 'occupied', area: 1400 },
  { id: 'f12', flatNumber: 'C-305', blockId: 'b3', blockName: 'Block C - Fountain Court', ownerName: '', occupancyStatus: 'maintenance', area: 1200 },
  { id: 'f13', flatNumber: 'D-104', blockId: 'b4', blockName: 'Block D - Raindrop Tower', ownerName: 'Sunita Gupta', occupancyStatus: 'occupied', area: 1350 },
  { id: 'f14', flatNumber: 'D-203', blockId: 'b4', blockName: 'Block D - Raindrop Tower', ownerName: 'Kavitha Nair', occupancyStatus: 'occupied', area: 1450 },
  { id: 'f15', flatNumber: 'D-401', blockId: 'b4', blockName: 'Block D - Raindrop Tower', ownerName: 'Rahul Mehta', occupancyStatus: 'occupied', area: 1550 },
  { id: 'f16', flatNumber: 'D-502', blockId: 'b4', blockName: 'Block D - Raindrop Tower', ownerName: '', occupancyStatus: 'vacant', area: 1600 },
];

// ── Dashboard Stats ────────────────────────────────────────────────────

export const mockDashboardStats: DashboardStats = {
  totalResidents: 156,
  totalBlocks: 4,
  monthlyWaterUsage: 45200,
  openComplaints: 8,
};

// ── Recent Activities ──────────────────────────────────────────────────

export const mockActivities: Activity[] = [
  {
    id: 'a1',
    title: 'New Resident Added',
    description: 'Arjun Desai moved into C-204',
    timestamp: '2024-03-10T10:30:00',
    type: 'resident',
  },
  {
    id: 'a2',
    title: 'Water Leak Reported',
    description: 'Block B - Pipeline leak near B-301',
    timestamp: '2024-03-09T15:45:00',
    type: 'complaint',
  },
  {
    id: 'a3',
    title: 'Monthly Bill Generated',
    description: 'March 2024 water bills sent to all residents',
    timestamp: '2024-03-08T09:00:00',
    type: 'water',
  },
  {
    id: 'a4',
    title: 'Maintenance Scheduled',
    description: 'Block C water tank cleaning on 15th March',
    timestamp: '2024-03-07T14:20:00',
    type: 'maintenance',
  },
  {
    id: 'a5',
    title: 'Notice Published',
    description: 'Water conservation drive starting next week',
    timestamp: '2024-03-06T11:15:00',
    type: 'notice',
  },
];

// ── Chart Data ─────────────────────────────────────────────────────────

export const mockWeeklyUsage: WeeklyUsageData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  data: [6200, 5800, 6500, 6100, 7200, 8100, 5300],
};

export const mockMonthlyComparison: MonthlyComparisonData = {
  labels: ['Block A', 'Block B', 'Block C', 'Block D'],
  datasets: [
    [12500, 10800, 9600, 12300], // Current month
    [13200, 11500, 10200, 13000], // Previous month
  ],
};

export const mockComplaintCategories: ComplaintCategoryData[] = [
  { name: 'Leakage', value: 35, color: '#2563EB' },
  { name: 'Quality', value: 25, color: '#0EA5E9' },
  { name: 'Billing', value: 20, color: '#06B6D4' },
  { name: 'Pressure', value: 12, color: '#22C55E' },
  { name: 'Other', value: 8, color: '#F59E0B' },
];
