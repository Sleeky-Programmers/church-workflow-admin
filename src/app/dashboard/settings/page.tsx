import { redirect } from 'next/navigation';

import { RouteConfig } from '@/config/routes';

export default function AdminPage() {
	redirect(RouteConfig.dashboard.admin.profile);
}
