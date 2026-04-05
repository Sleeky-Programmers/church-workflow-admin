'use client';

import { ArrowLeft, Building2, CalendarDays, HelpCircle, Home, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { DashboardGuard } from '@/components/auth/dashboard-guard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Text } from '@/components/ui/typography/Text';

import { Navbar } from '../Navbar';
import { RecentTracker } from '../recent-tracker';
import { AppSidebar } from '../Sidebar';

export function DashboardNotFound() {
	const router = useRouter();

	const quickLinks = [
		{ name: 'Overview', href: '/dashboard', icon: Home },
		{ name: 'Churches', href: '/dashboard/churches', icon: Building2 },
		{ name: 'Plan Management', href: '/dashboard/plans', icon: CalendarDays },
		{ name: 'Members', href: '/dashboard/membership', icon: Users },
	];

	return (
		<DashboardGuard>
			<SidebarProvider>
				<RecentTracker />
				<div className="relative flex min-h-screen w-full bg-gray-50">
					<AppSidebar />

					<SidebarInset className="min-w-0">
						<Navbar />
						<main className="min-w-0 w-full p-3 sm:p-4 md:p-6">
							<div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
								<Card className="max-w-2xl w-full rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
									<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700" />

									<CardHeader className="text-center pt-10 pb-6">
										<div className="mx-auto w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center mb-4">
											<span className="text-4xl font-bold text-primary-600">404</span>
										</div>
										<CardTitle className="text-xl sm:text-2xl font-semibold text-gray-800">Page not found in Dashboard</CardTitle>
										<CardDescription className="text-gray-500 mt-1">The dashboard page you're looking for doesn't exist.</CardDescription>
									</CardHeader>

									<CardContent className="space-y-5">
										{/* Helpful message */}
										<div className="bg-gray-50 rounded-xl p-4">
											<div className="flex items-start gap-3">
												<HelpCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
												<div>
													<Text
														text="Try these options instead:"
														variant="blue"
														className="font-medium text-sm"
													/>
													<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
														{quickLinks.map((link) => {
															const Icon = link.icon;
															return (
																<Link
																	key={link.name}
																	href={link.href}
																	className="flex items-center gap-2 p-2 rounded-lg hover:bg-white transition-colors group">
																	<Icon className="w-4 h-4 text-gray-400 group-hover:text-primary-600" />
																	<span className="text-sm text-gray-600 group-hover:text-primary-600">{link.name}</span>
																</Link>
															);
														})}
													</div>
												</div>
											</div>
										</div>

										{/* Suggested actions */}
										<div className="text-center">
											<Text
												text="or go back to where you came from"
												variant="muted"
												className="text-xs"
											/>
										</div>
									</CardContent>

									<CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pb-10">
										<Button
											asChild
											variant="default"
											className="gap-2">
											<Link href="/dashboard">
												<Home className="w-4 h-4" />
												Back to Dashboard
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
							</div>
						</main>
					</SidebarInset>
				</div>
			</SidebarProvider>
		</DashboardGuard>
	);
}
