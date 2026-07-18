'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { updatePassword } from '@/services/userServices';

type FormValues = {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
};

export function UpdatePasswordModal({ open, onOpenChange }: any) {
	const { toast } = useToast();
	const isMobile = useIsMobile();

	// State for toggling password visibility
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const {
		register,
		handleSubmit,
		watch,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>();

	const onSubmit = async (data: FormValues) => {
		try {
			await updatePassword({
				currentPassword: data.currentPassword,
				newPassword: data.newPassword,
				confirmNewPassword: data.confirmPassword,
			});

			toast({
				title: 'Success',
				description: 'Password updated successfully',
			});

			reset();
			onOpenChange(false);
		} catch (error: any) {
			toast({
				title: 'Error',
				description: error.message || 'Failed to update password',
				variant: 'destructive',
			});
		}
	};

	// Toggle functions
	const toggleCurrentPassword = () => setShowCurrentPassword(!showCurrentPassword);
	const toggleNewPassword = () => setShowNewPassword(!showNewPassword);
	const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}>
			<DialogContent
				mobileSheet={isMobile}
				className="sm:max-w-md p-0">
				<DialogHeader className="px-6 pt-6 pb-2">
					<DialogTitle>Update Password</DialogTitle>
				</DialogHeader>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="px-6 space-y-4">
					{/* Current Password */}
					<div className="space-y-2">
						<Label>Current Password</Label>
						<div className="relative">
							<Input
								type={showCurrentPassword ? 'text' : 'password'}
								{...register('currentPassword', {
									required: 'Current password is required',
								})}
								className="bg-gray-100 pr-10"
								placeholder="Enter current password"
							/>
							<button
								type="button"
								onClick={toggleCurrentPassword}
								className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 focus:outline-none"
								aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}>
								{showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
							</button>
						</div>
						{errors.currentPassword && <p className="text-red-500 text-sm mt-1">{errors.currentPassword.message}</p>}
					</div>

					{/* New Password */}
					<div className="space-y-2">
						<Label>New Password</Label>
						<div className="relative">
							<Input
								type={showNewPassword ? 'text' : 'password'}
								{...register('newPassword', {
									required: 'Password is required',
									minLength: {
										value: 6,
										message: 'Minimum 6 characters',
									},
								})}
								className="bg-gray-100 pr-10"
								placeholder="Enter new password"
							/>
							<button
								type="button"
								onClick={toggleNewPassword}
								className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 focus:outline-none"
								aria-label={showNewPassword ? 'Hide password' : 'Show password'}>
								{showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
							</button>
						</div>
						{errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>}
					</div>

					{/* Confirm Password */}
					<div className="space-y-2">
						<Label>Confirm Password</Label>
						<div className="relative">
							<Input
								type={showConfirmPassword ? 'text' : 'password'}
								{...register('confirmPassword', {
									required: 'Confirm password is required',
									validate: (val) => val === watch('newPassword') || 'Passwords do not match',
								})}
								className="bg-gray-100 pr-10"
								placeholder="Confirm new password"
							/>
							<button
								type="button"
								onClick={toggleConfirmPassword}
								className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 focus:outline-none"
								aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>
								{showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
							</button>
						</div>
						{errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
					</div>

					<DialogFooter className="py-4 border-t my-4">
						<Button
							type="button"
							variant="destructive"
							onClick={() => onOpenChange(false)}
							disabled={isSubmitting}>
							Cancel
						</Button>

						<Button
							type="submit"
							disabled={isSubmitting}>
							{isSubmitting ? 'Saving...' : 'Save'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
