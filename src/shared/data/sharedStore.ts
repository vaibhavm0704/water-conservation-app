// ============================================================
// AquaEstate — Centralized Shared Data Store
// Single source of truth for ALL modules / roles.
// When any role mutates data here, every other role sees it.
// ============================================================

// ── Shared Type Definitions ────────────────────────────────

export type ComplaintCategory = 'leakage' | 'no_water' | 'low_pressure' | 'dirty_water' | 'other';
export type ComplaintStatus = 'pending' | 'in_progress' | 'resolved';
export type ComplaintPriority = 'high' | 'medium' | 'low';
export type NoticeType = 'shutdown' | 'cleaning' | 'repair' | 'testing' | 'emergency';
export type NoticeStatus = 'active' | 'scheduled' | 'completed' | 'cancelled';

export const ISSUE_TYPE_LABELS: Record<ComplaintCategory, string> = {
  leakage: 'Leakage',
  no_water: 'No Water',
  low_pressure: 'Low Pressure',
  dirty_water: 'Dirty Water',
  other: 'Others',
};

export const ISSUE_TYPE_FULL_LABELS: Record<ComplaintCategory, string> = {
  leakage: 'Water Leakage',
  no_water: 'No Water Supply',
  low_pressure: 'Low Pressure',
  dirty_water: 'Dirty Water',
  other: 'Other Issue',
};

export interface SharedComplaint {
  id: string;
  ticketId: string;
  residentId: string;
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
  area: number;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  phone: string;
  available: boolean;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'resident' | 'complaint' | 'water' | 'maintenance' | 'notice';
}

export interface ComplaintDistribution {
  category: ComplaintCategory;
  label: string;
  percentage: number;
  color: string;
}

// ── Initial Mock Data ──────────────────────────────────────

let complaints: SharedComplaint[] = [
  // Resident "Ankit Verma" (usr_res_001) complaints
  {
    id: 'cmp-001',
    ticketId: 'TKT-2026-0041',
    residentId: 'usr_res_001',
    residentName: 'Ankit Verma',
    flatNumber: 'C-304',
    issueType: 'leakage',
    priority: 'high',
    status: 'pending',
    description: 'Water leaking from the kitchen tap even after shutting it completely.',
    date: '2026-06-24',
    assignedStaff: null,
    resolutionNotes: null,
    imageUri: null,
  },
  {
    id: 'cmp-002',
    ticketId: 'TKT-2026-0039',
    residentId: 'usr_res_001',
    residentName: 'Ankit Verma',
    flatNumber: 'C-304',
    issueType: 'low_pressure',
    priority: 'medium',
    status: 'in_progress',
    description: 'Very low water pressure in the bathroom shower during morning hours.',
    date: '2026-06-20',
    assignedStaff: 'staff-001',
    resolutionNotes: null,
    imageUri: null,
  },
  {
    id: 'cmp-003',
    ticketId: 'TKT-2026-0032',
    residentId: 'usr_res_001',
    residentName: 'Ankit Verma',
    flatNumber: 'C-304',
    issueType: 'no_water',
    priority: 'medium',
    status: 'resolved',
    description: 'No water supply on the 4th floor between 9 AM and 12 PM.',
    date: '2026-06-15',
    assignedStaff: 'staff-002',
    resolutionNotes: 'Restored water supply after clearing valve blockage on 4th floor.',
    imageUri: null,
  },
  // Complaints from other residents
  {
    id: 'c-001',
    ticketId: 'TKT-2026-0045',
    residentId: 'r1',
    residentName: 'Ananya Mehta',
    flatNumber: 'A-301',
    issueType: 'leakage',
    priority: 'high',
    status: 'pending',
    description: 'Severe water leakage from the kitchen ceiling. Water is dripping continuously and has damaged the false ceiling tiles.',
    date: '2026-07-15',
    assignedStaff: null,
    resolutionNotes: null,
    imageUri: null,
  },
  {
    id: 'c-002',
    ticketId: 'TKT-2026-0044',
    residentId: 'r5',
    residentName: 'Vikram Singh',
    flatNumber: 'B-504',
    issueType: 'no_water',
    priority: 'high',
    status: 'in_progress',
    description: 'No water supply since morning. All taps are completely dry. Other residents in the same block seem to have water.',
    date: '2026-07-14',
    assignedStaff: 'staff-001',
    resolutionNotes: null,
    imageUri: null,
  },
  {
    id: 'c-003',
    ticketId: 'TKT-2026-0043',
    residentId: 'r2',
    residentName: 'Priya Patel',
    flatNumber: 'C-202',
    issueType: 'low_pressure',
    priority: 'medium',
    status: 'pending',
    description: 'Very low water pressure in all bathrooms. The water barely trickles from the shower head.',
    date: '2026-07-13',
    assignedStaff: null,
    resolutionNotes: null,
    imageUri: null,
  },
  {
    id: 'c-004',
    ticketId: 'TKT-2026-0042',
    residentId: 'r3',
    residentName: 'Arjun Reddy',
    flatNumber: 'A-102',
    issueType: 'dirty_water',
    priority: 'high',
    status: 'pending',
    description: 'Yellowish/brownish water coming from all taps. Not safe for drinking or cooking.',
    date: '2026-07-13',
    assignedStaff: null,
    resolutionNotes: null,
    imageUri: null,
  },
  {
    id: 'c-005',
    ticketId: 'TKT-2026-0038',
    residentId: 'r4',
    residentName: 'Sneha Kulkarni',
    flatNumber: 'D-801',
    issueType: 'leakage',
    priority: 'medium',
    status: 'resolved',
    description: 'Minor leakage from the bathroom pipe connection near the water heater inlet.',
    date: '2026-07-10',
    assignedStaff: 'staff-002',
    resolutionNotes: 'Replaced the faulty pipe connector and applied waterproof sealant. Leak fixed.',
    imageUri: null,
  },
  {
    id: 'c-006',
    ticketId: 'TKT-2026-0037',
    residentId: 'r6',
    residentName: 'Rohan Iyer',
    flatNumber: 'B-303',
    issueType: 'no_water',
    priority: 'medium',
    status: 'resolved',
    description: 'Intermittent water supply in the kitchen. Water comes and goes every few minutes.',
    date: '2026-07-09',
    assignedStaff: 'staff-001',
    resolutionNotes: 'Found air lock in the supply line. Bled the pipes and restored consistent water flow.',
    imageUri: null,
  },
  {
    id: 'c-007',
    ticketId: 'TKT-2026-0036',
    residentId: 'r7',
    residentName: 'Kavitha Nair',
    flatNumber: 'C-605',
    issueType: 'other',
    priority: 'low',
    status: 'in_progress',
    description: 'Water meter running even when all taps closed. Suspect hidden leak.',
    date: '2026-07-12',
    assignedStaff: 'staff-004',
    resolutionNotes: null,
    imageUri: null,
  },
  {
    id: 'c-008',
    ticketId: 'TKT-2026-0035',
    residentId: 'r8',
    residentName: 'Divya Sharma',
    flatNumber: 'D-201',
    issueType: 'leakage',
    priority: 'medium',
    status: 'pending',
    description: 'Water seeping through the balcony wall. Seems to originate from the flat above.',
    date: '2026-07-14',
    assignedStaff: null,
    resolutionNotes: null,
    imageUri: null,
  },
];

let notices: WaterNotice[] = [
  {
    id: 'n-001',
    title: 'Water Shutdown - Pipeline Maintenance',
    description: 'Scheduled water shutdown for annual pipeline maintenance. All blocks affected. Store water beforehand.',
    type: 'shutdown',
    startTime: '2026-08-05 09:00 AM',
    endTime: '2026-08-05 05:00 PM',
    createdBy: 'Priya Patel',
    createdAt: '2026-07-20',
    status: 'scheduled',
  },
  {
    id: 'n-002',
    title: 'Tank Cleaning Schedule',
    description: 'Quarterly overhead tank cleaning for Block A and Block B. Water supply temporarily interrupted.',
    type: 'cleaning',
    startTime: '2026-07-28 06:00 AM',
    endTime: '2026-07-28 12:00 PM',
    createdBy: 'Priya Patel',
    createdAt: '2026-07-18',
    status: 'scheduled',
  },
  {
    id: 'n-003',
    title: 'Pipeline Repair Work',
    description: 'Urgent repair of underground pipeline connecting Block C to main tank. Minor leak detected.',
    type: 'repair',
    startTime: '2026-07-25 10:00 AM',
    endTime: '2026-07-25 04:00 PM',
    createdBy: 'Priya Patel',
    createdAt: '2026-07-22',
    status: 'active',
  },
  {
    id: 'n-004',
    title: 'Water Quality Testing',
    description: 'Monthly water quality testing. Samples from all blocks tested for pH, TDS, coliform, and heavy metals.',
    type: 'testing',
    startTime: '2026-07-26 08:00 AM',
    endTime: '2026-07-26 11:00 AM',
    createdBy: 'Priya Patel',
    createdAt: '2026-07-19',
    status: 'scheduled',
  },
  {
    id: 'n-005',
    title: 'Emergency Water Supply',
    description: 'Due to municipal disruption, tanker water arranged for all blocks. Tankers at 7 AM and 5 PM.',
    type: 'emergency',
    startTime: '2026-07-24 07:00 AM',
    endTime: '2026-07-24 09:00 PM',
    createdBy: 'Priya Patel',
    createdAt: '2026-07-24',
    status: 'active',
  },
];

let residents: Resident[] = [
  { id: 'r1', name: 'Rajesh Sharma', email: 'rajesh.sharma@email.com', phone: '+91 98765 43210', flatNumber: 'A-101', blockName: 'Block A - Riverside', status: 'active', joinDate: '2023-03-15' },
  { id: 'r2', name: 'Priya Patel', email: 'priya.patel@email.com', phone: '+91 87654 32109', flatNumber: 'A-203', blockName: 'Block A - Riverside', status: 'active', joinDate: '2023-06-20' },
  { id: 'r3', name: 'Amit Kumar', email: 'amit.kumar@email.com', phone: '+91 76543 21098', flatNumber: 'B-102', blockName: 'Block B - Lakeview', status: 'active', joinDate: '2023-01-10' },
  { id: 'r4', name: 'Sneha Reddy', email: 'sneha.reddy@email.com', phone: '+91 65432 10987', flatNumber: 'B-205', blockName: 'Block B - Lakeview', status: 'active', joinDate: '2023-08-05' },
  { id: 'r5', name: 'Vikram Singh', email: 'vikram.singh@email.com', phone: '+91 54321 09876', flatNumber: 'C-301', blockName: 'Block C - Fountain Court', status: 'pending', joinDate: '2024-01-22' },
  { id: 'r6', name: 'Ananya Iyer', email: 'ananya.iyer@email.com', phone: '+91 43210 98765', flatNumber: 'C-102', blockName: 'Block C - Fountain Court', status: 'active', joinDate: '2023-04-18' },
  { id: 'r7', name: 'Rahul Mehta', email: 'rahul.mehta@email.com', phone: '+91 32109 87654', flatNumber: 'D-401', blockName: 'Block D - Raindrop Tower', status: 'active', joinDate: '2023-07-12' },
  { id: 'r8', name: 'Kavitha Nair', email: 'kavitha.nair@email.com', phone: '+91 21098 76543', flatNumber: 'D-203', blockName: 'Block D - Raindrop Tower', status: 'inactive', joinDate: '2022-11-30' },
  { id: 'r9', name: 'Deepak Verma', email: 'deepak.verma@email.com', phone: '+91 90876 54321', flatNumber: 'A-305', blockName: 'Block A - Riverside', status: 'active', joinDate: '2023-09-01' },
  { id: 'r10', name: 'Meera Joshi', email: 'meera.joshi@email.com', phone: '+91 80987 65432', flatNumber: 'B-401', blockName: 'Block B - Lakeview', status: 'active', joinDate: '2024-02-14' },
  { id: 'r11', name: 'Arjun Desai', email: 'arjun.desai@email.com', phone: '+91 70123 45678', flatNumber: 'C-204', blockName: 'Block C - Fountain Court', status: 'pending', joinDate: '2024-03-10' },
  { id: 'r12', name: 'Sunita Gupta', email: 'sunita.gupta@email.com', phone: '+91 60234 56789', flatNumber: 'D-104', blockName: 'Block D - Raindrop Tower', status: 'active', joinDate: '2023-05-25' },
];

let activities: Activity[] = [
  { id: 'a1', title: 'Emergency Water Supply', description: 'Tanker water arranged due to municipal disruption', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), type: 'notice' },
  { id: 'a2', title: 'Water Leak Reported', description: 'Ananya Mehta reported ceiling leak in A-301', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), type: 'complaint' },
  { id: 'a3', title: 'Complaint Resolved', description: 'Pipe connector fixed for D-801', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), type: 'complaint' },
  { id: 'a4', title: 'Maintenance Scheduled', description: 'Block C pipeline repair on 25th July', timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), type: 'maintenance' },
  { id: 'a5', title: 'New Resident Pending', description: 'Arjun Desai applied for C-204', timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(), type: 'resident' },
];

const blocks: Block[] = [
  { id: 'b1', name: 'Block A - Riverside', totalFlats: 48, totalResidents: 42, description: 'Premium riverside apartments with garden view' },
  { id: 'b2', name: 'Block B - Lakeview', totalFlats: 40, totalResidents: 38, description: 'Lake-facing units with modern amenities' },
  { id: 'b3', name: 'Block C - Fountain Court', totalFlats: 36, totalResidents: 34, description: 'Central courtyard with fountain feature' },
  { id: 'b4', name: 'Block D - Raindrop Tower', totalFlats: 44, totalResidents: 42, description: 'Tallest tower with panoramic views' },
];

const flats: Flat[] = [
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

const staff: Staff[] = [
  { id: 'staff-001', name: 'Suresh Babu', role: 'Plumber', phone: '+91 87654 32100', available: true },
  { id: 'staff-002', name: 'Anil Sharma', role: 'Technician', phone: '+91 87654 32101', available: true },
  { id: 'staff-003', name: 'Deepak Yadav', role: 'Maintenance Lead', phone: '+91 87654 32102', available: false },
  { id: 'staff-004', name: 'Ravi Prasad', role: 'Plumber', phone: '+91 87654 32103', available: true },
];

// ── Helper ─────────────────────────────────────────────────

let ticketCounter = 50;

function pushActivity(title: string, description: string, type: Activity['type']) {
  activities.unshift({
    id: `act-${Date.now()}`,
    title,
    description,
    timestamp: new Date().toISOString(),
    type,
  });
  if (activities.length > 50) activities = activities.slice(0, 50);
}

function autoPriority(issueType: ComplaintCategory): ComplaintPriority {
  if (issueType === 'leakage' || issueType === 'no_water' || issueType === 'dirty_water') return 'high';
  if (issueType === 'low_pressure') return 'medium';
  return 'low';
}

// ── Complaints CRUD ────────────────────────────────────────

export function getAllComplaints(): SharedComplaint[] {
  return [...complaints];
}

export function getComplaintsByStatus(status?: ComplaintStatus): SharedComplaint[] {
  if (!status) return [...complaints];
  return complaints.filter((c) => c.status === status);
}

export function getComplaintsByResident(residentId: string): SharedComplaint[] {
  return complaints.filter((c) => c.residentId === residentId);
}

export function getComplaintById(id: string): SharedComplaint | null {
  const c = complaints.find((x) => x.id === id);
  return c ? { ...c } : null;
}

export function createComplaint(payload: {
  issueType: ComplaintCategory;
  description: string;
  imageUri?: string;
  residentId: string;
  residentName: string;
  flatNumber: string;
}): SharedComplaint {
  ticketCounter++;
  const newComplaint: SharedComplaint = {
    id: `cmp-${Date.now()}`,
    ticketId: `TKT-2026-${String(ticketCounter).padStart(4, '0')}`,
    residentId: payload.residentId,
    residentName: payload.residentName,
    flatNumber: payload.flatNumber,
    issueType: payload.issueType,
    priority: autoPriority(payload.issueType),
    status: 'pending',
    description: payload.description,
    date: new Date().toISOString().split('T')[0],
    assignedStaff: null,
    resolutionNotes: null,
    imageUri: payload.imageUri ?? null,
  };
  complaints = [newComplaint, ...complaints];
  pushActivity(
    'New Complaint Raised',
    `${payload.residentName} (${payload.flatNumber}) reported ${ISSUE_TYPE_LABELS[payload.issueType]}`,
    'complaint',
  );
  return { ...newComplaint };
}

export function assignComplaintToStaff(id: string, staffId: string): SharedComplaint {
  complaints = complaints.map((c) =>
    c.id === id ? { ...c, assignedStaff: staffId, status: 'in_progress' as const } : c,
  );
  const updated = complaints.find((c) => c.id === id);
  if (!updated) throw new Error('Complaint not found');
  const staffMember = staff.find((s) => s.id === staffId);
  pushActivity(
    'Staff Assigned',
    `${staffMember?.name ?? staffId} assigned to #${updated.ticketId}`,
    'complaint',
  );
  return { ...updated };
}

export function resolveComplaintById(id: string, notes: string): SharedComplaint {
  complaints = complaints.map((c) =>
    c.id === id ? { ...c, status: 'resolved' as const, resolutionNotes: notes } : c,
  );
  const updated = complaints.find((c) => c.id === id);
  if (!updated) throw new Error('Complaint not found');
  pushActivity(
    'Complaint Resolved',
    `#${updated.ticketId} for ${updated.residentName} (${updated.flatNumber}) resolved`,
    'complaint',
  );
  return { ...updated };
}

// ── Notices CRUD ───────────────────────────────────────────

export function getAllNotices(): WaterNotice[] {
  return [...notices];
}

export function createNewNotice(payload: {
  title: string;
  description: string;
  type: NoticeType;
  startTime: string;
  endTime: string;
  createdBy: string;
}): WaterNotice {
  const newNotice: WaterNotice = {
    id: `n-${Date.now()}`,
    title: payload.title,
    description: payload.description,
    type: payload.type,
    startTime: payload.startTime,
    endTime: payload.endTime,
    createdBy: payload.createdBy,
    createdAt: new Date().toISOString().split('T')[0],
    status: 'scheduled',
  };
  notices = [newNotice, ...notices];
  pushActivity('Notice Published', `"${payload.title}" by ${payload.createdBy}`, 'notice');
  return { ...newNotice };
}

// ── Residents CRUD ─────────────────────────────────────────

export function getAllResidents(): Resident[] {
  return [...residents];
}

export function searchResidentsByQuery(query: string): Resident[] {
  const q = query.toLowerCase();
  return residents.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      r.flatNumber.toLowerCase().includes(q) ||
      r.blockName.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q),
  );
}

export function addNewResident(data: Omit<Resident, 'id'>): Resident {
  const newResident: Resident = { ...data, id: `r${Date.now()}` };
  residents = [newResident, ...residents];
  pushActivity('New Resident Added', `${data.name} moved into ${data.flatNumber}`, 'resident');
  return { ...newResident };
}

export function updateResidentById(id: string, data: Partial<Resident>): Resident {
  residents = residents.map((r) => (r.id === id ? { ...r, ...data } : r));
  const updated = residents.find((r) => r.id === id);
  if (!updated) throw new Error('Resident not found');
  return { ...updated };
}

export function removeResidentById(id: string): boolean {
  const target = residents.find((r) => r.id === id);
  residents = residents.filter((r) => r.id !== id);
  if (target) {
    pushActivity('Resident Removed', `${target.name} removed from ${target.flatNumber}`, 'resident');
  }
  return true;
}

// ── Read-only data ─────────────────────────────────────────

export function getAllBlocks(): Block[] {
  return [...blocks];
}

export function getAllFlats(blockId?: string): Flat[] {
  if (blockId) return flats.filter((f) => f.blockId === blockId);
  return [...flats];
}

export function getAllStaff(): Staff[] {
  return [...staff];
}

export function getActivities(): Activity[] {
  return [...activities];
}

export function getStaffById(id: string): Staff | null {
  return staff.find((s) => s.id === id) ?? null;
}

// ── Dynamic Dashboard Stats ────────────────────────────────

export function getEstateDashboardStats() {
  return {
    totalResidents: residents.filter((r) => r.status === 'active').length,
    totalBlocks: blocks.length,
    monthlyWaterUsage: 45200,
    openComplaints: complaints.filter((c) => c.status !== 'resolved').length,
  };
}

export function getFacilityDashboardStats() {
  return {
    pendingComplaints: complaints.filter((c) => c.status === 'pending').length,
    resolvedIssues: complaints.filter((c) => c.status === 'resolved').length,
    waterUsage: 38500,
    scheduledMaintenance: notices.filter((n) => n.status === 'scheduled').length,
  };
}

export function getResidentDashboardStats(residentId: string) {
  const myComplaints = complaints.filter((c) => c.residentId === residentId);
  return {
    todayUsage: 85,
    monthlyUsage: 2450,
    currentBill: 1230,
    openComplaints: myComplaints.filter((c) => c.status !== 'resolved').length,
    waterSaved: 1850,
    conservationScore: 91,
  };
}

export function computeComplaintDistribution(): ComplaintDistribution[] {
  const total = complaints.length || 1;
  const counts: Record<ComplaintCategory, number> = { leakage: 0, no_water: 0, low_pressure: 0, dirty_water: 0, other: 0 };
  for (const c of complaints) counts[c.issueType]++;
  const colorMap: Record<ComplaintCategory, string> = {
    leakage: '#EF4444', no_water: '#3B82F6', low_pressure: '#F59E0B', dirty_water: '#92400E', other: '#94A3B8',
  };
  return (Object.keys(counts) as ComplaintCategory[]).map((cat) => ({
    category: cat,
    label: ISSUE_TYPE_FULL_LABELS[cat],
    percentage: Math.round((counts[cat] / total) * 100),
    color: colorMap[cat],
  }));
}
