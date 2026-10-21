'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/ui/loader';
import { PasswordInput } from '@/components/ui/passport-input';
import Heading from '@/components/ui/typography/Heading';
import { Span, Text } from '@/components/ui/typography/Text';
import { RouteConfig } from '@/config/routes';
import { googleAuth, login } from '@/lib/api';
import { getAuthErrorMessage } from '@/lib/auth/errors';
import { initializeAuthSession } from '@/lib/auth/session';
import { useAuthStore } from '@/stores/useAuthStore';
import { LoginFormValues } from '@/types/type';

import AuthAlert from '../auth-alert';
import GoogleSignupButton from '../oauth/google-signup-button';

interface LoginFormProps {
	onForgotPassword: () => void;
}

export default function LoginForm({ onForgotPassword }: LoginFormProps) {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const setUser = useAuthStore((state) => state.setUser);
	const form = useForm<LoginFormValues>({
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = async (values: LoginFormValues) => {
		form.clearErrors('root');
		setIsLoading(true);
		try {
			const data = await login(values);
			if (data?.accessToken && data.accessToken.length > 2 && data.refreshToken && data.refreshToken.length > 2) {
				const profile = initializeAuthSession({
					accessToken: data.accessToken,
					refreshToken: data.refreshToken,
					emailHint: values.email,
					user: data.user,
				});

				setUser({
					id: profile.id || profile.userKey,
					name: profile.fullName || profile.firstName || 'Super Admin',
					email: profile.email || values.email,
				});

				toast.success('Login successful. Redirecting to your dashboard...');
				router.push(RouteConfig.dashboard.home);
			} else {
				const message = 'Login failed: the server returned an incomplete response. Please try again.';
				form.setError('root', { type: 'manual', message });
				toast.error(message);
			}
		} catch (error: any) {
			const status = error?.response?.status ?? error?.status;
			const rawMessage = String(error?.message || '');

			if (status === 401 && /verify/i.test(rawMessage)) {
				if (typeof window !== 'undefined') {
					sessionStorage.setItem('pendingVerificationEmail', values.email);
				}
				toast.info('Your email is not verified yet. Please verify it to continue.');
				router.push(`${RouteConfig.auth.signUp}?verify=1&email=${encodeURIComponent(values.email)}`);
				return;
			}

			const message = getAuthErrorMessage(error, 'Unable to log in right now. Please try again.');
			form.setError('root', { type: 'manual', message });
			toast.error(message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleLogin = async (idToken: string) => {
		form.clearErrors('root');
		setIsLoading(true);
		try {
			const data = await googleAuth(idToken);
			const profile = initializeAuthSession({
				accessToken: data.accessToken,
				emailHint: data.user?.email,
				user: data.user,
			});

			setUser({
				id: profile.id || profile.userKey,
				name: profile.fullName || profile.firstName || 'Super Admin',
				email: profile.email || data.user?.email || '',
			});

			toast.success('Login successful. Redirecting...');
			if (data.user?.churchId) {
				router.push(RouteConfig.dashboard.home);
			} else {
				router.push(RouteConfig.onboarding);
			}
		} catch (error: any) {
			const message = getAuthErrorMessage(error, 'Google login failed. Please try again.');
			form.setError('root', { type: 'manual', message });
			toast.error(message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-8 animate-fade-in">
			<div className="text-left space-y-2">
				<Heading level={1}>Welcome back</Heading>
				<Text variant="muted">Welcome back! It only takes a moment to access your account.</Text>
			</div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
					noValidate>
					<AuthAlert message={form.formState.errors.root?.message} />
					<FormField
						control={form.control}
						name="email"
						rules={{
							required: 'Email is required',
							pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
						}}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										type="email"
										placeholder="Enter your email address"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="password"
						rules={{ required: 'Password is required' }}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<PasswordInput
										placeholder="Enter your password"
										{...field}
									/>
								</FormControl>
								<div className="flex justify-end">
									<Button
										type="button"
										variant="link"
										onClick={onForgotPassword}>
										Forgot password?
									</Button>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						type="submit"
						disabled={isLoading}
						className="w-full py-6">
						{isLoading ? (
							<Span className="flex items-center gap-2">
								<Loader />
								Logging in...
							</Span>
						) : (
							'Login'
						)}
					</Button>

					<div className="relative my-8 flex items-center">
						<div className="flex-grow border-t border-gray-200" />
						<Span
							variant="default"
							className="mx-4 px-4 py-1">
							OR
						</Span>
						<div className="flex-grow border-t border-gray-200" />
					</div>
					<GoogleSignupButton
						onCredential={handleGoogleLogin}
						disabled={isLoading}
						label="Continue with Google"
					/>
				</form>
			</Form>
		</div>
	);
}
