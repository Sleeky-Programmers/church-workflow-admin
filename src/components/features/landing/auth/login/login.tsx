'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/ui/loader';
import { PasswordInput } from '@/components/ui/passport-input';
import Heading from '@/components/ui/typography/Heading';
import { Span, Text } from '@/components/ui/typography/Text';
import { RouteConfig } from '@/config/routes';
import { googleAuth, login } from '@/lib/api';
import { initializeAuthSession } from '@/lib/auth/session';
import { useAuthStore } from '@/stores/useAuthStore';
import { LoginFormValues } from '@/types/type';

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
		setIsLoading(true);
		try {
			const data = await login(values);
			if (data.accessToken.length > 2 && data.refreshToken && data.refreshToken.length > 2) {
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

				router.push(RouteConfig.dashboard.home);
			} else {
				form.setError('root', {
					type: 'manual',
					message: 'An internal server error occurred. Please try again later.',
				});
			}
		} catch (error: any) {
			const status = error?.response?.status;
			const message = String(error?.message || '');

			if (status === 401) {
				if (/verify/i.test(message)) {
					if (typeof window !== 'undefined') {
						sessionStorage.setItem('pendingVerificationEmail', values.email);
					}
					router.push(`${RouteConfig.auth.signUp}?verify=1&email=${encodeURIComponent(values.email)}`);
					return;
				}
				form.setError('password', {
					type: 'manual',
					message: 'Invalid credentials',
				});
			} else {
				form.setError('root', {
					type: 'manual',
					message: 'An internal server error occurred. Please try again later.',
				});
			}
		} finally {
			setIsLoading(false);
		}
	};

	const onSignUp = () => router.push(RouteConfig.auth.signUp);

	const handleGoogleLogin = async (idToken: string) => {
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

			if (data.user?.churchId) {
				router.push(RouteConfig.dashboard.home);
			} else {
				router.push(RouteConfig.onboarding);
			}
		} catch (error: any) {
			form.setError('email', {
				message: error.message || 'Google login failed',
			});
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
					className="space-y-6">
					<FormField
						control={form.control}
						name="email"
						rules={{ required: 'Email is required' }}
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
			<div className="text-center">
				<Text variant="muted">
					Don&apos;t have an account yet?
					<Button
						onClick={onSignUp}
						variant="link">
						Create Church Account
					</Button>
				</Text>
			</div>
		</div>
	);
}
