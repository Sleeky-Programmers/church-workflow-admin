'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar';
import { AdminSidebarData } from '@/lib/data';
import { ActiveTab } from '@/lib/enums';
import { cn } from '@/lib/utils';
import { useFavoritesStore } from '@/stores/useFavoritesStore';

import { Span, Text } from '../ui/typography/Text';

export function AppSidebar() {
	const pathname = usePathname();
	const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.FAVOURITES);
	const { favorites } = useFavoritesStore();
	const { isMobile, setOpenMobile } = useSidebar();

	const isActive = (url: string) => {
		if (!url) return false;
		const normalize = (p: string | null | undefined) => (p ? p.replace(/\/+$/, '').replace(/^$/, '') : '');
		const current = normalize(pathname);
		const target = normalize(url);
		return current === target;
	};

	const handleNavigate = () => {
		if (isMobile) {
			setOpenMobile(false);
		}
	};

	return (
		<Sidebar>
			<SidebarContent>
				<SidebarHeader>
					<div className="px-2 sm:px-4 py-2 sm:py-3">
						<Image
							src="/assets/logo/horizontal/main.png"
							alt="Church Workflow"
							width={160}
							height={48}
							priority
						/>
					</div>

					<SidebarMenu className="grid grid-cols-2 gap-2 sm:gap-3">
						<SidebarMenuItem>
							<SidebarMenuButton
								isActive={activeTab === ActiveTab.FAVOURITES}
								onClick={() => setActiveTab(ActiveTab.FAVOURITES)}>
								<Text variant={activeTab === ActiveTab.FAVOURITES ? 'tab' : 'tabInactive'}>Favourites</Text>
							</SidebarMenuButton>
						</SidebarMenuItem>

						<SidebarMenuItem>
							<SidebarMenuButton
								isActive={activeTab === ActiveTab.RECENT}
								onClick={() => setActiveTab(ActiveTab.RECENT)}>
								<Text variant={activeTab === ActiveTab.RECENT ? 'tab' : 'tabInactive'}>Recent</Text>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>
				{activeTab === ActiveTab.FAVOURITES && (
					<SidebarGroup>
						<SidebarGroupLabel>Favourites</SidebarGroupLabel>

						<SidebarGroupContent>
							{favorites.length === 0 ? (
								<Text
									variant="muted"
									className="px-3 py-2">
									No starred pages yet
								</Text>
							) : (
								<SidebarMenu>
									{favorites.map((fav) => {
										const active = isActive(fav.path);

										return (
											<SidebarMenuItem key={fav.path}>
												<SidebarMenuButton
													asChild
													isActive={active}>
													<Link
														href={fav.path}
														className="flex items-center gap-2"
														onClick={handleNavigate}>
														<Span variant={active ? 'menuActive' : 'menuInactive'}>•</Span>
														<Text variant="default">{fav.label}</Text>
													</Link>
												</SidebarMenuButton>
											</SidebarMenuItem>
										);
									})}
								</SidebarMenu>
							)}
						</SidebarGroupContent>
					</SidebarGroup>
				)}

				<SidebarGroup>
					<SidebarGroupLabel>Pages</SidebarGroupLabel>

					<SidebarGroupContent>
						<SidebarMenu>
							{AdminSidebarData.pages.map((page) => {
								const active = isActive(page.url);
								const Icon = page.icon;

								return (
									<SidebarMenuItem key={page.title}>
										<SidebarMenuButton
											asChild
											isActive={active}>
											<Link
												href={page.url}
												className="flex items-center gap-2"
												onClick={handleNavigate}>
												<Icon className={cn('h-4 w-4 transition-colors', active ? 'text-primary' : 'text-primary/70')} />

												<Text variant="default">{page.title}</Text>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarFooter className="mt-auto">
					<SidebarMenu>
						{AdminSidebarData.footer.map((page) => (
							<SidebarMenuItem key={page.title}>
								<SidebarMenuButton
									asChild
									isActive={isActive(page.url)}>
									<Link
										href={page.url}
										onClick={handleNavigate}>
										<page.icon />
										<Text>{page.title}</Text>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarFooter>
			</SidebarContent>
		</Sidebar>
	);
}
