import { AlertCircle, CheckCircle2 } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface AuthAlertProps {
	message?: string;
	variant?: 'error' | 'success';
	className?: string;
}

export default function AuthAlert({ message, variant = 'error', className }: AuthAlertProps) {
	if (!message) return null;

	const isError = variant === 'error';
	const Icon = isError ? AlertCircle : CheckCircle2;

	return (
		<Alert
			variant={isError ? 'destructive' : 'default'}
			className={cn(!isError && 'border-green-500/50 text-green-700 [&>svg]:text-green-600', 'bg-background', className)}>
			<Icon className="h-4 w-4 mt-0.5 shrink-0" />
			<AlertDescription className={cn(isError ? 'text-destructive' : 'text-green-700')}>{message}</AlertDescription>
		</Alert>
	);
}
