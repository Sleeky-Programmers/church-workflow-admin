/**
 * Turns anything thrown by the API layer into a message that is safe to show a user.
 * Prefers the server's own message, and falls back to a status-specific one.
 */
export function getAuthErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
	const err = error as { status?: number; response?: { status?: number }; message?: string } | null;
	const status = err?.status ?? err?.response?.status;
	const message = typeof err?.message === 'string' ? err.message.trim() : '';

	// fetch() rejects with a TypeError when the network or server is unreachable
	if (error instanceof TypeError || /failed to fetch|networkerror|load failed/i.test(message)) {
		return 'Unable to reach the server. Check your internet connection and try again.';
	}

	if (status === 429) return 'Too many attempts. Please wait a moment and try again.';
	if (status && status >= 500) return 'The server ran into a problem. Please try again shortly.';

	if (message && message !== 'Request failed' && message !== 'Unauthorized') return message;

	switch (status) {
		case 400:
			return 'The details you entered are invalid. Please check them and try again.';
		case 401:
			return 'Invalid email or password.';
		case 403:
			return 'You do not have permission to do this.';
		case 404:
			return 'We could not find an account with those details.';
		default:
			return fallback;
	}
}
