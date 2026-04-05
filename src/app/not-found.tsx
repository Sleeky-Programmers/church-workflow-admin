'use client';

import { ArrowLeft, Building2, HelpCircle, Home, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { DashboardNotFound } from '@/components/layout/Not-Found/Non-dashboard-routes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Heading from '@/components/ui/typography/Heading';
import { Text } from '@/components/ui/typography/Text';

export default function GlobalNotFoundPage() {
	const router = useRouter();
	const pathname = usePathname();

	if (pathname.includes('/dashboard')) {
		return <DashboardNotFound />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
			<div className="absolute top-6 left-6">
				<Link
					href="/"
					className="flex items-center gap-2 group">
					<div className="w-8 h-8 rounded-lg text-primary-600 bg-primary-100 group-hover:bg-primary-600 group-hover:text-white-700 flex items-center justify-center transition-all duration-500 ease-in-out">
						<Building2 className="w-5 h-5" />
					</div>
					<span className="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">Admin</span>
				</Link>
			</div>

			<Card className="max-w-lg w-full rounded-3xl shadow-lg border-0 overflow-hidden">
				<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700" />

				<CardHeader className="text-center pt-12 pb-6">
					<div className="mx-auto w-24 h-24 rounded-full bg-primary-50 flex items-center justify-center mb-4">
						<span className="text-5xl font-bold text-primary-600">404</span>
					</div>
					<CardTitle className="text-2xl sm:text-3xl font-semibold text-gray-800">Page not found</CardTitle>
					<CardDescription className="text-gray-500 mt-2">Oops! The page you're looking for doesn't exist or has been moved.</CardDescription>
				</CardHeader>

				<CardContent className="space-y-4">
					<div className="bg-gray-50 rounded-xl p-4">
						<div className="flex items-start gap-3">
							<HelpCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
							<div>
								<Text
									text="What could have happened?"
									variant="blue"
									className="font-medium text-sm"
								/>
								<ul className="mt-2 space-y-1 text-sm text-gray-600">
									<li>• The page might have been moved to a new location</li>
									<li>• The URL might have a typo</li>
									<li>• You might not have permission to view this page</li>
								</ul>
							</div>
						</div>
					</div>
				</CardContent>

				<CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pb-12">
					<Button
						asChild
						variant="default"
						className="gap-2">
						<Link href="/dashboard">
							<Home className="w-4 h-4" />
							Go to Dashboard
						</Link>
					</Button>
					<Button
						variant="outline"
						onClick={() => router.back()}
						className="gap-2">
						<ArrowLeft className="w-4 h-4" />
						Go Back
					</Button>
				</CardFooter>
			</Card>

			<div className="absolute bottom-6 left-0 right-0 text-center">
				<Text
					text="Need help? Contact support"
					variant="muted"
					className="text-xs"
				/>
			</div>
		</div>
	);
}
