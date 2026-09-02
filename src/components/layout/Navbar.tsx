'use client';

import { ArrowLeft, Bell, Search, Star, User, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { RouteConfig } from '@/config/routes';
import { getCurrentUserProfile } from '@/lib/auth/session';
import { useAuthStore } from '@/stores/useAuthStore';
import { useFavoritesStore } from '@/stores/useFavoritesStore';
import { useSearchStore } from '@/stores/useSearchStore';

import { Avatar, AvatarFallback } from '../ui/avatar';
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator
} from '../ui/breadcrumb';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { SidebarTrigger } from '../ui/sidebar';
import { Text } from '../ui/typography/Text';

export function Navbar() {
	const pathname = usePathname() || RouteConfig.dashboard.home;
	const router = useRouter();
	const searchParams = useSearchParams();

	// Use search store for global state management
	const { searchQuery, setSearchQuery, clearSearch, updateURLSearch, syncFromURL, isSearching } = useSearchStore();

	const [fallbackName, setFallbackName] = useState('John Doe');
	const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
	const mobileInputRef = useRef<HTMLInputElement>(null);
	const { toggleFavorite, isFavorite } = useFavoritesStore();
	const { user } = useAuthStore();
	const starred = isFavorite(pathname);

	// Sync search from URL on mount and when URL changes
	useEffect(() => {
		syncFromURL(searchParams);
	}, [searchParams, syncFromURL]);

	// Autofocus the input when the mobile search expands
	useEffect(() => {
		if (mobileSearchOpen) {
			mobileInputRef.current?.focus();
		}
	}, [mobileSearchOpen]);

	// Fetch user profile for fallback name
	useEffect(() => {
		const profile = getCurrentUserProfile();
		if (profile?.firstName) {
			setFallbackName(profile.firstName);
			return;
		}
		if (profile?.fullName) {
			setFallbackName(profile.fullName);
		}
	}, []);

	const pageLabel = useMemo(() => {
		const path = pathname.replace(/\/+$/, '');
		if (!path.startsWith('/dashboard')) return 'Overview';
		const rest = path.replace(/^\/dashboard\/?/, '');
		if (!rest) return 'Overview';
		return rest
			.split('/')[0]
			.replace(/[-_]+/g, ' ')
			.replace(/\b\w/g, (c: string) => c.toUpperCase());
	}, [pathname]);

	// Handle search with store integration
	const handleSearch = () => {
		if (!searchQuery.trim()) {
			// If search is empty, clear URL param
			clearSearch();
			updateURLSearch(pathname, router);
			return;
		}

		// Navigate to search results page
		router.push(`${RouteConfig.dashboard.search}?q=${encodeURIComponent(searchQuery)}`);
	};

	// Handle search input change
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	// Handle clear search
	const handleClearSearch = () => {
		clearSearch();
		updateURLSearch(pathname, router);
	};

	// Handle search on Enter key
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		// if (e.key === 'Enter') {
		// 	e.preventDefault();
		// 	handleSearch();
		// }
		// Escape key to clear/close search
		if (e.key === 'Escape') {
			if (mobileSearchOpen) {
				closeMobileSearch();
			} else {
				handleClearSearch();
			}
		}
	};

	// Expand the mobile search input
	const openMobileSearch = () => {
		setMobileSearchOpen(true);
	};

	// Collapse the mobile search input and clear the query
	const closeMobileSearch = () => {
		setMobileSearchOpen(false);
		clearSearch();
		updateURLSearch(pathname, router);
	};

	return (
		<header className="relative w-full flex items-center h-16 gap-2 px-3 md:px-6 border-b">
			{/* Expanded mobile search overlay */}
			{mobileSearchOpen && (
				<div className="absolute inset-0 z-10 flex items-center gap-2 px-3 bg-background sm:hidden">
					<Button
						size="icon"
						variant="ghost"
						aria-label="Close search"
						onClick={closeMobileSearch}>
						<ArrowLeft className="w-4 h-4" />
					</Button>
					<div className="relative flex-1">
						<Input
							ref={mobileInputRef}
							placeholder="Search..."
							value={searchQuery}
							onChange={handleSearchChange}
							onKeyDown={handleKeyDown}
							className="w-full pr-8"
						/>
						{searchQuery && (
							<Button
								size="icon"
								variant="ghost"
								className="absolute right-0 top-0 h-full px-3 w-auto rounded-full hover:bg-transparent hover:scale-110"
								onClick={handleClearSearch}
								aria-label="Clear search">
								<X className="size-4 text-muted-foreground hover:text-foreground transition-colors" />
							</Button>
						)}
					</div>
				</div>
			)}

			<div className="flex items-center gap-2 min-w-0">
				<SidebarTrigger className="-ml-1" />
				<Button
					size="icon"
					variant={starred ? 'starred' : 'ghost'}
					aria-label="Star this page"
					className="transition-transform hover:scale-110"
					onClick={() =>
						toggleFavorite({
							path: pathname,
							label: pageLabel,
						})
					}>
					<Star
						className="w-4 h-4 transition-transform"
						fill={starred ? 'currentColor' : 'none'}
					/>
				</Button>
				<div className="hidden md:block min-w-0">
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<Link href={RouteConfig.dashboard.home}>Dashboard</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>{pageLabel}</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</div>

			<div className="ml-auto flex items-center gap-3">
				{/* Mobile search button */}
				<Button
					size="icon"
					variant="ghost"
					className="sm:hidden"
					aria-label="Open search"
					onClick={openMobileSearch}>
					<Search className="w-4 h-4" />
				</Button>

				{/* Desktop search input */}
				<div className="hidden sm:block relative">
					<Input
						leftIcon={<Search className="w-4 h-4" />}
						placeholder="Search..."
						value={searchQuery}
						onChange={handleSearchChange}
						onKeyDown={handleKeyDown}
						className="w-48 md:w-64 pr-8 transition-all duration-200 focus:w-56 md:focus:w-72"
					/>
					{/* Clear button - only show when there's text */}
					{searchQuery && (
						<Button
							size="icon"
							variant="ghost"
							className="absolute right-0 top-0 h-full px-3  w-auto rounded-full hover:bg-transparent hover:scale-110"
							onClick={handleClearSearch}
							aria-label="Clear search">
							<X className="size-4 text-muted-foreground hover:text-foreground transition-colors" />
						</Button>
					)}
				</div>

				{/* Notifications */}
				<Link href={RouteConfig.dashboard.notifications}>
					<Button
						size="icon"
						variant="ghost"
						aria-label="Notifications"
						className="relative transition-transform hover:scale-110">
						<Bell className="w-4 h-4" />
						{/* Optional: Add notification badge */}
						{/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" /> */}
					</Button>
				</Link>

				{/* User profile */}
				<Link href={RouteConfig.dashboard.admin.profile}>
					<Button
						variant="ghost"
						className="flex items-center gap-2 p-0 hover:bg-transparent transition-opacity hover:opacity-80">
						<Avatar className="h-8 w-8 ring-0 ring-primary/30 transition-all hover:ring-2">
							<AvatarFallback className="bg-primary/10 text-primary text-xs">
								{user?.name ? user.name.charAt(0).toUpperCase() : fallbackName.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<Text
							variant="default"
							className="hidden sm:block text-sm font-medium">
							{user?.name || fallbackName}
						</Text>
					</Button>
				</Link>
			</div>
		</header>
	);
}
