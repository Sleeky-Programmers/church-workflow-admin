const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const CURRENT_USER_KEY = "auth:current-user";
const USER_PROFILE_PREFIX = "auth:user-profile:";
const ONBOARDING_PREFIX = "onboarding:state:";

type UnknownRecord = Record<string, unknown>;

export type SessionUser = {
  id?: string;
  _id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  role?: string;
};

export type UserProfile = {
  userKey: string;
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  role?: string;
};

export type ChurchIdentityRecord = {
  name: string;
  alias?: string;
  address: string;
  country: string;
  state?: string;
  defaultCurrency: string;
  timeZone: string;
  logoUrl?: string;
  logoPublicId?: string;
};

export type OnboardingState = {
  churchIdentityCompleted: boolean;
  weeklyServicesCompleted: boolean;
  membersUploaded: boolean;
  churchIdentity?: ChurchIdentityRecord;
  updatedAt: string;
};

const DEFAULT_ONBOARDING_STATE: OnboardingState = {
  churchIdentityCompleted: false,
  weeklyServicesCompleted: false,
  membersUploaded: false,
  updatedAt: "",
};

function isClient(): boolean {
  return typeof window !== "undefined";
}

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function toUserKey(input?: string): string {
  const normalized = (input || "").trim().toLowerCase();
  return normalized || "unknown-user";
}

function decodeJwtPayload(token: string): UnknownRecord | null {
  const segments = token.split(".");
  if (segments.length < 2) return null;
  try {
    const payload = segments[1].replace(/-/g, "+").replace(/_/g, "/");
    const parsed = atob(payload);
    return JSON.parse(parsed) as UnknownRecord;
  } catch {
    return null;
  }
}

function inferIdentityFromToken(token: string): {
  email?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  id?: string;
} {
  const payload = decodeJwtPayload(token);
  if (!payload) return {};

  const email =
    (payload.email as string | undefined) ||
    (payload.preferred_username as string | undefined);

  const firstName =
    (payload.firstName as string | undefined) ||
    (payload.given_name as string | undefined);
  const lastName =
    (payload.lastName as string | undefined) ||
    (payload.family_name as string | undefined);
  const name = payload.name as string | undefined;
  const id =
    (payload.sub as string | undefined) ||
    (payload.userId as string | undefined);

  return { email, firstName, lastName, name, id };
}

function profileStorageKey(userKey: string): string {
  return `${USER_PROFILE_PREFIX}${userKey}`;
}

function onboardingStorageKey(userKey: string): string {
  return `${ONBOARDING_PREFIX}${userKey}`;
}

export function getAccessToken(): string | null {
  if (!isClient()) return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getCurrentUserKey(): string | null {
  if (!isClient()) return null;
  return window.localStorage.getItem(CURRENT_USER_KEY);
}

export function initializeAuthSession(args: {
  accessToken: string;
  refreshToken?: string;
  emailHint?: string;
  user?: SessionUser;
}): UserProfile {
  if (!isClient()) {
    return { userKey: "unknown-user" };
  }

  const tokenIdentity = inferIdentityFromToken(args.accessToken);
  const incomingUserId = args.user?.id || args.user?._id;
  const email =
    args.user?.email || args.emailHint || tokenIdentity.email || undefined;
  const firstName =
    args.user?.firstName || tokenIdentity.firstName || undefined;
  const lastName = args.user?.lastName || tokenIdentity.lastName || undefined;
  const fullName =
    args.user?.name ||
    tokenIdentity.name ||
    [firstName, lastName].filter(Boolean).join(" ") ||
    undefined;
  const resolvedUserKey = toUserKey(
    email || incomingUserId || tokenIdentity.id,
  );

  const profile: UserProfile = {
    userKey: resolvedUserKey,
    id: incomingUserId || tokenIdentity.id,
    email,
    firstName,
    lastName,
    fullName,
    role: args.user?.role,
  };

  window.localStorage.setItem(ACCESS_TOKEN_KEY, args.accessToken);

  if (args.refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, args.refreshToken);
  }
  window.localStorage.setItem(CURRENT_USER_KEY, resolvedUserKey);
  window.localStorage.setItem(
    profileStorageKey(resolvedUserKey),
    JSON.stringify(profile),
  );

  const existingOnboarding = safeJsonParse<OnboardingState>(
    window.localStorage.getItem(onboardingStorageKey(resolvedUserKey)),
  );
  if (!existingOnboarding) {
    window.localStorage.setItem(
      onboardingStorageKey(resolvedUserKey),
      JSON.stringify({
        ...DEFAULT_ONBOARDING_STATE,
        updatedAt: new Date().toISOString(),
      }),
    );
  }

  return profile;
}

export function getCurrentUserProfile(): UserProfile | null {
  if (!isClient()) return null;
  const userKey = getCurrentUserKey();
  if (!userKey) return null;
  return safeJsonParse<UserProfile>(
    window.localStorage.getItem(profileStorageKey(userKey)),
  );
}

export function getCurrentOnboardingState(): OnboardingState | null {
  if (!isClient()) return null;
  const userKey = getCurrentUserKey();
  if (!userKey) return null;
  return safeJsonParse<OnboardingState>(
    window.localStorage.getItem(onboardingStorageKey(userKey)),
  );
}

export function shouldCurrentUserCompleteOnboarding(): boolean {
  const token = getAccessToken();
  if (!token) return false;
  const onboarding = getCurrentOnboardingState();
  if (!onboarding) return true;
  return !onboarding.churchIdentityCompleted;
}

export function updateCurrentOnboardingState(
  updater: (current: OnboardingState) => OnboardingState,
): OnboardingState | null {
  if (!isClient()) return null;
  const userKey = getCurrentUserKey();
  if (!userKey) return null;

  const current = getCurrentOnboardingState() || {
    ...DEFAULT_ONBOARDING_STATE,
    updatedAt: new Date().toISOString(),
  };

  const next = {
    ...updater(current),
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(
    onboardingStorageKey(userKey),
    JSON.stringify(next),
  );
  return next;
}

export function markChurchIdentityComplete(
  identity: ChurchIdentityRecord,
): OnboardingState | null {
  return updateCurrentOnboardingState((current) => ({
    ...current,
    churchIdentityCompleted: true,
    churchIdentity: identity,
  }));
}

export function markWeeklyServicesComplete(): OnboardingState | null {
  return updateCurrentOnboardingState((current) => ({
    ...current,
    weeklyServicesCompleted: true,
  }));
}

export function markMembersUploaded(): OnboardingState | null {
  return updateCurrentOnboardingState((current) => ({
    ...current,
    membersUploaded: true,
  }));
}
