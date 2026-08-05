import {
    Activity, Building2, Calendar1, CalendarCheck2, ChartPie, CheckCircle, CreditCard, DollarSign,
    FileText, Gift, Inbox, Layers, LogOut, MessagesSquare, NotepadTextDashed, Receipt, Settings,
    Tag, TrendingUp, UserPlus, Users, Wallet
} from 'lucide-react';

import {
    ActivityRow, DepartmentRow, MemberAttendanceRecord, MemberProfile, RegularService, Role
} from '@/types';
import { ProductAdminModule } from '@/types/productAdmin';

import {
    EventCategory, Gender, MaritalStatus, MembershipStatus, MemberTitle, RequisitionStatus
} from './enums';

export const DEFAULT_ORDER = ['Opening Prayer', 'Praise and Worship', 'Bible Reading', 'Sermon', 'Offering', 'Closing Prayer'];

export const COUNTRIES = [
	{ code: 'NG', name: 'Nigeria', currency: 'NGN', timeZone: 'Africa/Lagos' },
	{
		code: 'US',
		name: 'United States',
		currency: 'USD',
		timeZone: 'America/New_York',
	},
	{
		code: 'GB',
		name: 'United Kingdom',
		currency: 'GBP',
		timeZone: 'Europe/London',
	},
	{ code: 'CA', name: 'Canada', currency: 'CAD', timeZone: 'America/Toronto' },
	{ code: 'GH', name: 'Ghana', currency: 'GHS', timeZone: 'Africa/Accra' },
	{ code: 'KE', name: 'Kenya', currency: 'KES', timeZone: 'Africa/Nairobi' },
	{
		code: 'ZA',
		name: 'South Africa',
		currency: 'ZAR',
		timeZone: 'Africa/Johannesburg',
	},
	{ code: 'IN', name: 'India', currency: 'INR', timeZone: 'Asia/Kolkata' },
	{ code: 'PH', name: 'Philippines', currency: 'PHP', timeZone: 'Asia/Manila' },
	{
		code: 'AU',
		name: 'Australia',
		currency: 'AUD',
		timeZone: 'Australia/Sydney',
	},
	{ code: 'DE', name: 'Germany', currency: 'EUR', timeZone: 'Europe/Berlin' },
	{ code: 'FR', name: 'France', currency: 'EUR', timeZone: 'Europe/Paris' },
	{ code: 'JP', name: 'Japan', currency: 'JPY', timeZone: 'Asia/Tokyo' },
	{ code: 'CN', name: 'China', currency: 'CNY', timeZone: 'Asia/Shanghai' },
	{
		code: 'BR',
		name: 'Brazil',
		currency: 'BRL',
		timeZone: 'America/Sao_Paulo',
	},
	{
		code: 'MX',
		name: 'Mexico',
		currency: 'MXN',
		timeZone: 'America/Mexico_City',
	},
	{ code: 'IT', name: 'Italy', currency: 'EUR', timeZone: 'Europe/Rome' },
	{ code: 'ES', name: 'Spain', currency: 'EUR', timeZone: 'Europe/Madrid' },
	{
		code: 'NL',
		name: 'Netherlands',
		currency: 'EUR',
		timeZone: 'Europe/Amsterdam',
	},
	{ code: 'SE', name: 'Sweden', currency: 'SEK', timeZone: 'Europe/Stockholm' },
	{ code: 'NO', name: 'Norway', currency: 'NOK', timeZone: 'Europe/Oslo' },
	{
		code: 'DK',
		name: 'Denmark',
		currency: 'DKK',
		timeZone: 'Europe/Copenhagen',
	},
	{
		code: 'CH',
		name: 'Switzerland',
		currency: 'CHF',
		timeZone: 'Europe/Zurich',
	},
	{
		code: 'SG',
		name: 'Singapore',
		currency: 'SGD',
		timeZone: 'Asia/Singapore',
	},
	{
		code: 'MY',
		name: 'Malaysia',
		currency: 'MYR',
		timeZone: 'Asia/Kuala_Lumpur',
	},
	{ code: 'TH', name: 'Thailand', currency: 'THB', timeZone: 'Asia/Bangkok' },
	{
		code: 'VN',
		name: 'Vietnam',
		currency: 'VND',
		timeZone: 'Asia/Ho_Chi_Minh',
	},
	{ code: 'ID', name: 'Indonesia', currency: 'IDR', timeZone: 'Asia/Jakarta' },
	{ code: 'PK', name: 'Pakistan', currency: 'PKR', timeZone: 'Asia/Karachi' },
	{ code: 'BD', name: 'Bangladesh', currency: 'BDT', timeZone: 'Asia/Dhaka' },
	{ code: 'LK', name: 'Sri Lanka', currency: 'LKR', timeZone: 'Asia/Colombo' },
	{ code: 'NP', name: 'Nepal', currency: 'NPR', timeZone: 'Asia/Kathmandu' },
	{ code: 'AE', name: 'UAE', currency: 'AED', timeZone: 'Asia/Dubai' },
	{
		code: 'SA',
		name: 'Saudi Arabia',
		currency: 'SAR',
		timeZone: 'Asia/Riyadh',
	},
	{ code: 'TR', name: 'Turkey', currency: 'TRY', timeZone: 'Europe/Istanbul' },
	{ code: 'EG', name: 'Egypt', currency: 'EGP', timeZone: 'Africa/Cairo' },
	{
		code: 'MA',
		name: 'Morocco',
		currency: 'MAD',
		timeZone: 'Africa/Casablanca',
	},
	{
		code: 'TZ',
		name: 'Tanzania',
		currency: 'TZS',
		timeZone: 'Africa/Dar_es_Salaam',
	},
	{ code: 'UG', name: 'Uganda', currency: 'UGX', timeZone: 'Africa/Kampala' },
	{ code: 'RW', name: 'Rwanda', currency: 'RWF', timeZone: 'Africa/Kigali' },
	{
		code: 'ET',
		name: 'Ethiopia',
		currency: 'ETB',
		timeZone: 'Africa/Addis_Ababa',
	},
];

export const CURRENCIES = [
	{ code: 'NGN', label: 'Nigerian Naira (NGN)' },
	{ code: 'USD', label: 'US Dollar (USD)' },
	{ code: 'EUR', label: 'Euro (EUR)' },
	{ code: 'GBP', label: 'British Pound (GBP)' },
	{ code: 'CAD', label: 'Canadian Dollar (CAD)' },
	{ code: 'GHS', label: 'Ghanaian Cedi (GHS)' },
	{ code: 'KES', label: 'Kenyan Shilling (KES)' },
	{ code: 'ZAR', label: 'South African Rand (ZAR)' },
	{ code: 'INR', label: 'Indian Rupee (INR)' },
	{ code: 'PHP', label: 'Philippine Peso (PHP)' },
	{ code: 'AUD', label: 'Australian Dollar (AUD)' },
	{ code: 'JPY', label: 'Japanese Yen (JPY)' },
	{ code: 'CNY', label: 'Chinese Yuan (CNY)' },
	{ code: 'BRL', label: 'Brazilian Real (BRL)' },
	{ code: 'MXN', label: 'Mexican Peso (MXN)' },
	{ code: 'SEK', label: 'Swedish Krona (SEK)' },
	{ code: 'NOK', label: 'Norwegian Krone (NOK)' },
	{ code: 'DKK', label: 'Danish Krone (DKK)' },
	{ code: 'CHF', label: 'Swiss Franc (CHF)' },
	{ code: 'SGD', label: 'Singapore Dollar (SGD)' },
	{ code: 'MYR', label: 'Malaysian Ringgit (MYR)' },
	{ code: 'THB', label: 'Thai Baht (THB)' },
	{ code: 'VND', label: 'Vietnamese Dong (VND)' },
	{ code: 'IDR', label: 'Indonesian Rupiah (IDR)' },
	{ code: 'PKR', label: 'Pakistani Rupee (PKR)' },
	{ code: 'BDT', label: 'Bangladeshi Taka (BDT)' },
	{ code: 'LKR', label: 'Sri Lankan Rupee (LKR)' },
	{ code: 'NPR', label: 'Nepalese Rupee (NPR)' },
	{ code: 'AED', label: 'UAE Dirham (AED)' },
	{ code: 'SAR', label: 'Saudi Riyal (SAR)' },
	{ code: 'TRY', label: 'Turkish Lira (TRY)' },
	{ code: 'EGP', label: 'Egyptian Pound (EGP)' },
	{ code: 'MAD', label: 'Moroccan Dirham (MAD)' },
	{ code: 'TZS', label: 'Tanzanian Shilling (TZS)' },
	{ code: 'UGX', label: 'Ugandan Shilling (UGX)' },
	{ code: 'RWF', label: 'Rwandan Franc (RWF)' },
	{ code: 'ETB', label: 'Ethiopian Birr (ETB)' },
];

export const TIME_ZONES = [
	'Africa/Lagos',
	'Africa/Accra',
	'Africa/Nairobi',
	'Africa/Johannesburg',
	'Africa/Cairo',
	'Africa/Casablanca',
	'Africa/Dar_es_Salaam',
	'Africa/Kampala',
	'Africa/Kigali',
	'Africa/Addis_Ababa',
	'America/New_York',
	'America/Chicago',
	'America/Denver',
	'America/Los_Angeles',
	'America/Toronto',
	'America/Sao_Paulo',
	'America/Mexico_City',
	'America/Phoenix',
	'America/Anchorage',
	'America/Halifax',
	'America/Argentina/Buenos_Aires',
	'Europe/London',
	'Europe/Berlin',
	'Europe/Paris',
	'Europe/Rome',
	'Europe/Madrid',
	'Europe/Amsterdam',
	'Europe/Stockholm',
	'Europe/Oslo',
	'Europe/Copenhagen',
	'Europe/Zurich',
	'Europe/Istanbul',
	'Europe/Moscow',
	'Asia/Kolkata',
	'Asia/Manila',
	'Australia/Sydney',
	'Asia/Tokyo',
	'Asia/Shanghai',
	'Asia/Singapore',
	'Asia/Kuala_Lumpur',
	'Asia/Bangkok',
	'Asia/Ho_Chi_Minh',
	'Asia/Jakarta',
	'Asia/Karachi',
	'Asia/Dhaka',
	'Asia/Colombo',
	'Asia/Kathmandu',
	'Asia/Dubai',
	'Asia/Riyadh',
	'Asia/Tehran',
	'Asia/Baghdad',
	'UTC',
];

export const SidebarData = {
	pages: [
		{
			title: 'Dashboard',
			url: '/dashboard',
			icon: ChartPie,
		},
		{
			title: 'Membership',
			url: '/dashboard/membership',
			icon: Inbox,
		},
		{
			title: 'Attendance',
			url: '/dashboard/attendance',
			icon: CalendarCheck2,
		},
		{
			title: 'Departments/Units',
			url: '/dashboard/departments',
			icon: Layers,
		},
		{
			title: 'Small Teams',
			url: '/dashboard/teams',
			icon: Users,
		},
		{
			title: 'Events & Reminders',
			url: '/dashboard/events',
			icon: Calendar1,
		},
		{
			title: 'Communications',
			url: '/dashboard/communications',
			icon: MessagesSquare,
		},
		{
			title: 'Requisitions',
			url: '/dashboard/requisitions',
			icon: NotepadTextDashed,
		},
		{
			title: 'Finance',
			url: '/dashboard/finance',
			icon: Wallet,
		},
	],
	footer: [
		{
			title: 'Settings/Admin',
			url: '/dashboard/settings',
			icon: Settings,
		},
		{
			title: 'Activity Log',
			url: '/dashboard/activity-log',
			icon: Activity,
		},
		{
			title: 'Logout',
			url: '/auth/login',
			icon: LogOut,
		},
	],
};

export const AdminSidebarData = {
	pages: [
		{
			title: 'Overview',
			url: '/dashboard',
			icon: ChartPie,
		},
		{
			title: 'Analytics',
			url: '/dashboard/analytics',
			icon: TrendingUp,
		},
		{
			title: 'Churches',
			url: '/dashboard/churches',
			icon: Building2,
			permissionModule: ProductAdminModule.CHURCH_MANAGEMENT,
		},
		{
			title: 'User Management',
			url: '/dashboard/users',
			icon: Users,
			permissionModule: ProductAdminModule.USER_MANAGEMENT,
		},
		{
			title: 'Payments',
			url: '/dashboard/payments',
			icon: Receipt,
			permissionModule: ProductAdminModule.PAYMENT_MANAGEMENT,
		},
		{
			title: 'Coupons',
			url: '/dashboard/coupons',
			icon: Gift,
			permissionModule: ProductAdminModule.COUPON_MANAGEMENT,
		},
	],
	footer: [
		{
			title: 'Settings',
			url: '/dashboard/settings/profile',
			icon: Settings,
		},
		// Activity Log - commented out for now, can be re-added later
		// {
		//   title: 'Activity Log',
		//   url: '/dashboard/activity-log',
		//   icon: Activity,
		// },
		{
			title: 'Logout',
			url: '/auth/login',
			icon: LogOut,
		},
	],
};

export const DashboardData = {
	stats: {
		totalMembers: '30,350',
		serviceAttendance: '3,671',
		totalIncome: '2,318',
		totalMembersGrowth: '+10%',
		attendanceGrowth: '-10.5%',
		incomeGrowth: '+15%',
	},
	attendanceData: [
		{ month: 'Jan', thisMonth: 11598, lastMonth: 9000 },
		{ month: 'Feb', thisMonth: 12000, lastMonth: 10000 },
		{ month: 'Mar', thisMonth: 15000, lastMonth: 11000 },
		{ month: 'Apr', thisMonth: 21000, lastMonth: 17000 },
		{ month: 'May', thisMonth: 26000, lastMonth: 22000 },
		{ month: 'Jun', thisMonth: 23000, lastMonth: 20000 },
		{ month: 'Jul', thisMonth: 25000, lastMonth: 21000 },
	],
	incomeExpenses: [
		{ month: 'Jan', income: 800, expenses: 400 },
		{ month: 'Feb', income: 1200, expenses: 600 },
		{ month: 'Mar', income: 1400, expenses: 700 },
		{ month: 'Apr', income: 1100, expenses: 500 },
		{ month: 'May', income: 1500, expenses: 800 },
		{ month: 'Jun', income: 1300, expenses: 700 },
	],
	incomeBreakdown: [
		{ name: 'Tithes', value: 52.1, color: '#2563EB' },
		{ name: 'Offering', value: 22.8, color: '#F97316' },
		{ name: 'Seeds', value: 13.9, color: '#10B981' },
		{ name: 'Donations', value: 11.2, color: '#EF4444' },
	],
	upcomingEvents: [
		{
			title: 'Sunday Service',
			date: '2026-02-25',
			category: EventCategory.GENERAL,
		},
		{
			title: 'Leaders Meeting',
			date: '2026-02-26',
			category: EventCategory.LEADERSHIP,
		},
		{
			title: 'Morning Devotion',
			date: '2026-02-27',
			category: EventCategory.LEADERSHIP,
		},
		{
			title: 'Bible Study',
			date: '2026-02-22',
			category: EventCategory.GENERAL,
		},
		{
			title: 'Youth Convention',
			date: '2026-02-23',
			category: EventCategory.SPECIAL,
		},
	],

	birthdays: [
		{ name: 'Pastor John', date: '2026-03-24' },
		{ name: 'John Doe', date: '2026-02-18' },
		{ name: 'Pastor Peter', date: '2026-02-12' },
	],
};

export const NotificationData = [
	{
		icon: CheckCircle,
		title: 'Requisition Approved by HOD',
		description: 'Sound system upgrade request was approved',
		date: 'Just Now',
		isRead: false,
		iconBg: 'bg-green-100',
		iconColor: 'text-green-700',
	},
	{
		icon: FileText,
		title: 'Offering Report Ready - March 2026',
		description: 'Total ₦380,000 collected across 3 branches',
		date: '30 mins ago',
		isRead: false,
		iconBg: 'bg-orange-100',
		iconColor: 'text-orange-600',
	},
	{
		icon: DollarSign,
		title: 'Salary Payment Successful',
		description: 'Salaries for 6 staff members completed',
		date: '1 hour ago',
		isRead: false,
		iconBg: 'bg-emerald-100',
		iconColor: 'text-emerald-700',
	},
	{
		icon: UserPlus,
		title: 'New Member Registered',
		description: 'Gloria Samuel added to Youth Church',
		date: '8 hours ago',
		isRead: false,
		iconBg: 'bg-blue-100',
		iconColor: 'text-blue-700',
	},
	{
		icon: Gift,
		title: 'Upcoming Birthday: Ade Samuel',
		description: 'Birthday is tomorrow - May 16',
		date: '1 day ago',
		isRead: false,
		iconBg: 'bg-rose-100',
		iconColor: 'text-rose-600',
	},
	{
		icon: Tag,
		title: 'Subscription Expiring in 3 Days',
		description: 'Current plan will expire on May 18',
		date: '30 days ago',
		isRead: false,
		iconBg: 'bg-violet-100',
		iconColor: 'text-violet-700',
	},
];

export const ActivityLogData: ActivityRow[] = [
	{
		_id: '1',
		updatedAt: '',
		createdAt: '2025-12-15T10:34:00',
		adminId: { firstName: 'John', lastName: 'Doe' },
		action: 'Submitted a requisition',
		module: 'Requisition',
		details: 'For media projector (₦150,000)',
	},
	{
		_id: '2',
		updatedAt: '',
		createdAt: '2025-12-14T19:15:00',
		adminId: { firstName: 'Admin', lastName: '' },
		action: 'Approved requisition',
		module: 'Requisition',
		details: 'For generator diesel',
	},
	{
		_id: '3',
		updatedAt: '',
		createdAt: '2026-01-14T17:42:00',
		adminId: { firstName: 'Gloria', lastName: 'A.' },
		action: 'Added new church member',
		module: 'Membership',
		details: 'Member: Peter Samuel',
	},
	{
		_id: '4',
		updatedAt: '',
		createdAt: '2026-01-13T14:05:00',
		adminId: { firstName: 'Ruth', lastName: 'B.' },
		action: 'Logged in',
		module: 'Authentication',
		details: 'IP: 102.67.34.98',
	},
	{
		_id: '5',
		updatedAt: '',
		createdAt: '2026-01-14T17:42:00',
		adminId: { firstName: 'David', lastName: 'O.' },
		action: 'Sent out event reminders',
		module: 'Events',
		details: 'For Sunday Thanksgiving Service',
	},
	{
		_id: '6',
		updatedAt: '',
		createdAt: '2026-01-15T10:34:00',
		adminId: { firstName: 'John', lastName: 'Doe' },
		action: 'Submitted a requisition',
		module: 'Requisition',
		details: 'For media projector (₦150,000)',
	},
	{
		_id: '7',
		updatedAt: '',
		createdAt: '2026-02-06T19:15:00',
		adminId: { firstName: 'Admin', lastName: '' },
		action: 'Approved requisition',
		module: 'Requisition',
		details: 'For generator diesel',
	},
	{
		_id: '8',
		updatedAt: '',
		createdAt: '2026-02-08T17:42:00',
		adminId: { firstName: 'Gloria', lastName: 'A.' },
		action: 'Added new church member',
		module: 'Membership',
		details: 'Member: Peter Samuel',
	},
	{
		_id: '9',
		updatedAt: '',
		createdAt: '2025-12-29T14:05:00',
		adminId: { firstName: 'Ruth', lastName: 'B.' },
		action: 'Logged in',
		module: 'Authentication',
		details: 'IP: 102.67.34.98',
	},
	{
		_id: '10',
		updatedAt: '',
		createdAt: '2025-12-30T17:42:00',
		adminId: { firstName: 'David', lastName: 'O.' },
		action: 'Sent out event reminders',
		module: 'Events',
		details: "New Year's Cross Over Service",
	},
];

export const departmentData: DepartmentRow[] = [
	{
		id: '1',
		name: 'Media Team',
		hod: { name: 'John Doe', initials: 'JD' },
		members: 6,
		status: 'Active',
	},
	{
		id: '2',
		name: 'Ushering',
		hod: { name: 'Sister Mary', initials: 'SM' },
		members: 10,
		status: 'Active',
	},
	{
		id: '3',
		name: 'Choir',
		hod: { name: 'Mr. Caleb', initials: 'MC' },
		members: 19,
		status: 'Active',
	},
	{
		id: '4',
		name: 'Evangelism',
		hod: { name: 'Pastor', initials: 'P' },
		members: 15,
		status: 'Active',
	},
];

export const smallTeamsData = [
	{
		id: 'team-1',
		name: 'Lincoln Folk',
		leader: { name: 'John Doe', initials: 'JD' },
		members: 6,
		status: 'Active',
	},
	{
		id: 'team-2',
		name: 'Youth Group A',
		leader: { name: 'Mary Doe', initials: 'MD' },
		members: 10,
		status: 'Active',
	},
	{
		id: 'team-3',
		name: 'Youth Group B',
		leader: { name: 'John Doe', initials: 'JD' },
		members: 19,
		status: 'Active',
	},
	{
		id: 'team-4',
		name: 'Men of Valor',
		leader: { name: 'Mary Doe', initials: 'MD' },
		members: 15,
		status: 'Active',
	},
];

export const departmentMembers = [
	{
		id: 'm1',
		name: 'Jane Smith',
		role: 'Assistant HOD',
		joined: 'Jan 2023',
		contact: '+234 801 234 5678',
	},
	{
		id: 'm2',
		name: 'Michael James',
		role: 'Camera Operator',
		joined: 'Feb 2024',
		contact: '+234 801 234 5678',
	},
	{
		id: 'm3',
		name: 'Deborah Ajayi',
		role: 'Sound Tech',
		joined: 'March 2022',
		contact: '+234 801 234 5678',
	},
];

export const departmentEvents = [
	{
		id: 'e1',
		event: 'Sunday Worship',
		date: 'May 26, 2026',
		status: 'Completed',
		assigned: 'Yes',
	},
	{
		id: 'e2',
		event: 'Leadership Retreat',
		date: 'June 10, 2026',
		status: 'Completed',
		assigned: 'Yes',
	},
	{
		id: 'e3',
		event: 'Community Service',
		date: 'July 15, 2026',
		status: 'Upcoming',
		assigned: 'No',
	},
];

export const departmentRequisitions = [
	{
		id: 'rq1',
		date: 'May 12',
		title: 'New Microphones',
		amount: '₦80,000',
		status: RequisitionStatus.PENDING,
	},
	{
		id: 'rq2',
		date: 'Apr 10',
		title: 'Mixer Replacement',
		amount: '₦120,000',
		status: RequisitionStatus.APPROVED,
	},
	{
		id: 'rq3',
		date: 'March 14',
		title: 'HDMI Cables Replacement',
		amount: '₦60,000',
		status: RequisitionStatus.APPROVED,
	},
];

export const MOCK_ROLES: Role[] = [
	{
		id: '1',
		name: 'Admin',
		type: 'system',
		users: 2,
		status: 'active',
		description: 'Admin can do everything apart from inviting a new user.',
	},
	{
		id: '2',
		name: 'Finance',
		type: 'system',
		users: 3,
		status: 'active',
		description: 'Finance role has access to financial data and reports.',
	},
	{
		id: '3',
		name: 'Pastor',
		type: 'system',
		users: 4,
		status: 'active',
		description: 'Pastor role has access to member management.',
	},
	{
		id: '4',
		name: 'Media Lead',
		type: 'custom',
		users: 1,
		status: 'active',
		description: 'Manages media and events',
	},
	{
		id: '5',
		name: 'Welfare Lead',
		type: 'custom',
		users: 0,
		status: 'disabled',
		description: 'Manages welfare activities',
	},
];

function generateMockAttendanceRecords(): MemberAttendanceRecord[] {
	const services = ['Sunday First Service', 'Sunday Second Service', 'Midweek Service', 'Friday Service'];

	const records: MemberAttendanceRecord[] = [];
	const startDate = new Date(2026, 0, 1);

	for (let i = 0; i < 60; i++) {
		const date = new Date(startDate);
		date.setDate(date.getDate() + i);

		const service = services[Math.floor(Math.random() * services.length)];
		const status = Math.random() > 0.2 ? 'Present' : 'Absent';

		records.push({
			id: `record-${i + 1}`,
			service,
			date: date.toISOString().split('T')[0],
			status: status as 'Present' | 'Absent',
			recordedBy: 'Admin',
			time: `${Math.floor(Math.random() * 12) + 7}:${Math.floor(Math.random() * 60)
				.toString()
				.padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
		});
	}

	return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export const MOCK_MEMBERS_FULL: MemberProfile[] = Array.from({ length: 100 }, (_, i) => {
	const firstNames = [
		'Taylor',
		'Alex',
		'Jordan',
		'Morgan',
		'Casey',
		'Avery',
		'Riley',
		'Peyton',
		'Quinn',
		'Sage',
		'Johnson',
		'Michael',
		'Sarah',
		'David',
		'Emily',
		'James',
		'Jessica',
		'Christopher',
		'Jennifer',
		'Matthew',
	];

	const lastNames = [
		'Davidson',
		'Johnson',
		'Williams',
		'Brown',
		'Davis',
		'Miller',
		'Wilson',
		'Moore',
		'Taylor',
		'Anderson',
		'Thomas',
		'Jackson',
		'White',
		'Harris',
		'Martin',
	];

	const titles: MemberTitle[] = [MemberTitle.MR, MemberTitle.MRS, MemberTitle.MISS, MemberTitle.DR, MemberTitle.PASTOR, MemberTitle.REV];
	const genders: Gender[] = [Gender.MALE, Gender.FEMALE];
	const maritalStatuses: MaritalStatus[] = [MaritalStatus.SINGLE, MaritalStatus.MARRIED, MaritalStatus.DIVORCED, MaritalStatus.WIDOWED];

	const firstName = firstNames[i % firstNames.length];
	const lastName = lastNames[Math.floor(i / 5) % lastNames.length];
	const fullName = `${firstName} ${lastName}`;
	const email = `${firstName.toLowerCase()}${i + 1}@gmail.com`;
	const phone = `+234 ${Math.floor(800 + Math.random() * 100)} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)}`;

	const title = titles[i % titles.length];
	const gender = genders[i % 2];
	const maritalStatus = maritalStatuses[i % 4];

	const year = 1960 + Math.floor(Math.random() * 40);
	const month = Math.floor(Math.random() * 12);
	const day = Math.floor(Math.random() * 28) + 1;
	const birthday = `${day}${getDaySuffix(day)} ${getMonthName(month)}, ${year}`;
	const attendanceRecords = generateMockAttendanceRecords();
	const servicesAttended = attendanceRecords.filter((r) => r.status === 'Present').length;
	const servicesMissed = attendanceRecords.filter((r) => r.status === 'Absent').length;
	const attendanceRate = Math.round((servicesAttended / (servicesAttended + servicesMissed)) * 100);

	return {
		id: `member-${i + 1}`,
		title,
		fullName,
		firstName,
		lastName,
		email,
		phone,
		gender,
		birthday,
		address: 'Abuja, Nigeria',
		maritalStatus,
		dateOfMarriage: maritalStatus === MaritalStatus.MARRIED ? '1st of March, 1999' : undefined,

		membershipStatus: MembershipStatus.MEMBER,
		dateJoined: '14th of March, 2026',
		baptized: Math.random() > 0.3,
		volunteersPreference: 'Interested',

		servicesAttended,
		servicesMissed,
		attendanceRate,

		attendanceRecords,

		initials: `${firstName[0]}${lastName[0]}`.toUpperCase(),
		avatar: undefined,
	};
});

export const smallTeamMemberMap: Record<string, string[]> = {
	'team-1': MOCK_MEMBERS_FULL.slice(0, 6).map((member) => member.id),
	'team-2': MOCK_MEMBERS_FULL.slice(6, 16).map((member) => member.id),
	'team-3': MOCK_MEMBERS_FULL.slice(16, 35).map((member) => member.id),
	'team-4': MOCK_MEMBERS_FULL.slice(35, 50).map((member) => member.id),
};

function getDaySuffix(day: number): string {
	if (day >= 11 && day <= 13) return 'th';
	switch (day % 10) {
		case 1:
			return 'st';
		case 2:
			return 'nd';
		case 3:
			return 'rd';
		default:
			return 'th';
	}
}

function getMonthName(month: number): string {
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	return months[month];
}

export const MOCK_SERVICES: RegularService[] = [
	{
		id: 'service-1',
		serviceName: 'Sunday Service',
		days: ['Sunday'],
		startTime: '08:00',
		endTime: '11:00',
		location: 'Main Auditorium',
		frequency: 'weekly',
		attendanceRecords: [],
	},
	{
		id: 'service-2',
		serviceName: 'Sunday First Service',
		days: ['Sunday'],
		startTime: '07:00',
		endTime: '09:00',
		location: 'Church Auditorium',
		frequency: 'weekly',
		attendanceRecords: [],
	},
	{
		id: 'service-3',
		serviceName: 'Sunday Second Service',
		days: ['Sunday'],
		startTime: '09:00',
		endTime: '11:00',
		location: 'Church Auditorium',
		frequency: 'weekly',
		attendanceRecords: [],
	},
	{
		id: 'service-4',
		serviceName: 'Wednesday Service',
		days: ['Wednesday'],
		startTime: '18:00',
		endTime: '20:00',
		location: 'Prayer Room',
		frequency: 'weekly',
		attendanceRecords: [],
	},
	{
		id: 'service-5',
		serviceName: 'Friday Service',
		days: ['Friday'],
		startTime: '17:30',
		location: 'Main Auditorium',
		frequency: 'weekly',
		attendanceRecords: [],
	},
];
export const MOCK_SINGLE_MEMBER = MOCK_MEMBERS_FULL[0];

export const MOCK_ADMIN = {
	id: 'admin-1',
	name: 'Admin_003',
};

export const AVATAR_COLORS: { bg: string; text: string }[] = [
	{ bg: 'bg-primary-100', text: 'text-primary-600' },
	{ bg: 'bg-secondary-100', text: 'text-secondary-500' },
	{ bg: 'bg-success-100', text: 'text-success-600' },
	{ bg: 'bg-violet-100', text: 'text-violet-600' },
	{ bg: 'bg-rose-100', text: 'text-rose-500' },
	{ bg: 'bg-amber-100', text: 'text-amber-600' },
	{ bg: 'bg-cyan-100', text: 'text-cyan-600' },
	{ bg: 'bg-pink-100', text: 'text-pink-500' },
];
