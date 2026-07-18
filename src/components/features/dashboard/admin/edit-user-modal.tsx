'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/typography/Text';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from '@/services/userServices';

type FormValues = {
	name: string;
	email: string;
};

export function EditProductAdminModal({
	open,
	onOpenChange,
	admin,
	onUpdated,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	admin: any;
	onUpdated?: (updated: any) => void;
}) {
	const { toast } = useToast();
	const isMobile = useIsMobile();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>();

	useEffect(() => {
		if (open && admin) {
			reset({
				name: admin?.name || '',
				email: admin?.email || '',
			});
		}
	}, [open, admin, reset]);

	const onSubmit = async (data: FormValues) => {
		try {
			const updated = await updateProfile(data);

			toast({
				title: 'Success',
				description: 'Profile updated successfully',
			});

			onUpdated?.(updated);
			onOpenChange(false);
		} catch (error: any) {
			toast({
				title: 'Error',
				description: error.message || 'Update failed',
				variant: 'destructive',
			});
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}>
			<DialogContent
				mobileSheet={isMobile}
				className="sm:max-w-lg p-0">
				<DialogHeader className="px-6 pt-6 pb-2">
					<DialogTitle>Update Admin Information</DialogTitle>
				</DialogHeader>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="px-6 pb-5 space-y-4">
					<div>
						<Label htmlFor="name">Full Name</Label>
						<Input
							id="name"
							{...register('name', {
								required: 'Name is required',
								minLength: {
									value: 2,
									message: 'Name must be at least 2 characters',
								},
							})}
							className="bg-gray-100"
							placeholder="Enter your full name"
						/>
						{errors.name && (
							<Text
								variant="error"
								className="text-sm mt-1">
								{errors.name.message}
							</Text>
						)}
					</div>

					<div>
						<Label htmlFor="email">Email Address</Label>
						<Input
							id="email"
							type="email"
							{...register('email', {
								required: 'Email is required',
								pattern: {
									value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
									message: 'Invalid email address',
								},
							})}
							className="bg-gray-100"
							placeholder="Enter your email address"
						/>
						{errors.email && (
							<Text
								variant="error"
								className="text-sm mt-1">
								{errors.email.message}
							</Text>
						)}
					</div>

					<DialogFooter className="pt-4 border-t mt-4">
						<Button
							type="button"
							variant="destructive"
							onClick={() => onOpenChange(false)}
							size="sm">
							Cancel
						</Button>

						<Button
							type="submit"
							size="sm"
							disabled={isSubmitting}>
							{isSubmitting ? 'Saving...' : 'Save Changes'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
