import React from 'react';

import { cn } from '@/lib/utils';

type TextProps = {
	text?: string;
	className?: string;
	style?: React.CSSProperties;
	variant?:
		| 'default'
		| 'muted'
		| 'warning'
		| 'error'
		| 'partner'
		| 'quote'
		| 'tag'
		| 'tab'
		| 'tabInactive'
		| 'menuActive'
		| 'indicator'
		| 'label'
		| 'blue'
		| 'dot'
		| 'menuInactive'
		| 'pending'
		| 'chip'
		| 'success';
	children?: React.ReactNode;
};

export function Text({ text, className, variant = 'default', children }: TextProps) {
	const variantClass = {
		default: 'text-foreground',
		muted: 'text-muted-foreground',
		warning: 'text-amber-600 dark:text-amber-400',
		error: 'text-destructive',
		partner: 'text-lg text-muted-foreground font-medium tracking-wide transition-opacity hover:opacity-70',
		quote: 'text-lg md:text-xl font-serif italic text-primary-foreground',
		tag: 'text-xs bg-background px-2 py-1 rounded',
		tab: 'text-primary font-medium',
		tabInactive: 'text-primary/60 font-medium',
		menuActive: 'text-primary font-medium',
		menuInactive: 'text-primary/60 font-medium',
		indicator: 'inline-block w-2 h-2 rounded-full bg-primary',
		label: 'font-semibold text-foreground text-md',
		blue: 'text-primary font-medium',
		dot: 'h-2 w-2 rounded-full bg-primary flex-shrink-0',
		pending: 'text-xs font-medium text-foreground bg-accent border border-input',
		success: 'text-foreground font-medium bg-accent',
		chip: 'rounded-full border border-input bg-primary-100 px-2.5 py-1 text-xs text-foreground',
	}[variant];

	return <p className={cn('text-sm', variantClass, className)}>{children ?? text}</p>;
}

export function Span({ text, className, style, variant = 'default', children }: TextProps) {
	const variantClass = {
		default: 'text-foreground',
		muted: 'text-muted-foreground',
		warning: 'text-amber-600 dark:text-amber-400',
		error: 'text-destructive',
		partner: 'text-lg text-muted-foreground font-medium tracking-wide transition-opacity hover:opacity-70',
		quote: 'text-lg md:text-xl font-serif italic text-primary-foreground',
		tag: 'text-xs bg-background px-2 py-1 rounded',
		tab: 'text-primary font-medium',
		tabInactive: 'text-primary font-medium',
		menuActive: 'text-primary font-medium',
		menuInactive: 'text-primary/60 font-medium',
		indicator: 'inline-block w-2 h-2 rounded-full bg-primary',
		label: 'font-medium text-foreground',
		blue: 'text-primary font-medium',
		dot: 'inline-block w-3 h-3 rounded-full',
		pending: 'text-xs font-medium text-foreground bg-accent border border-input',
		success: 'text-foreground font-medium bg-accent border border-input',
		chip: 'rounded-full border border-input bg-primary-100 px-2.5 py-1 text-xs text-foreground',
	}[variant];

	return (
		<span
			className={cn('text-xs', variantClass, className)}
			style={style}>
			{children ?? text}
		</span>
	);
}
