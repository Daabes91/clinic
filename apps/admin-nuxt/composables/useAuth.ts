import type { AuthTokensResponse, StaffLoginRequest } from "@/types/auth";

const ACCESS_COOKIE = "admin_access_token";
const REFRESH_COOKIE = "admin_refresh_token";
const REFRESH_LEAD_TIME = 60_000;

export function useAuth() {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;

  const accessTokenCookie = useCookie<string | null>(ACCESS_COOKIE, {
    sameSite: "lax",
    secure: true,
    httpOnly: false,
    maxAge: 60 * 60
  });
  const refreshTokenCookie = useCookie<string | null>(REFRESH_COOKIE, {
    sameSite: "lax",
    secure: true,
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 30
  });

  const accessToken = useState<string | null>("auth.accessToken", () => accessTokenCookie.value ?? null);
  const accessTokenExpiresAt = useState<number | null>("auth.accessTokenExpiresAt", () => null);
  const userEmail = useState<string | null>("auth.userEmail", () => null);
  const userName = useState<string | null>("auth.userName", () => null);
  const userRole = useState<string | null>("auth.userRole", () => null);
  let refreshTimeout: ReturnType<typeof setTimeout> | null = null;
  let refreshPromise: Promise<void> | null = null;

  hydrateUserFromToken(accessToken.value);

  const isAuthenticated = computed(() => {
    if (!accessToken.value) {
      return false;
    }
    if (!accessTokenExpiresAt.value) {
      return true;
    }
    return Date.now() < accessTokenExpiresAt.value - 5_000;
  });

  async function login(payload: StaffLoginRequest) {
    try {
      const response = await $fetch<AuthTokensResponse>("/auth/login", {
        baseURL: apiBase,
        method: "POST",
        body: payload
      });

      persistTokens(response);
      await fetchProfile();
    } catch (error: any) {
      clearAuth();
      throw normalizeError(error);
    }
  }

  async function refresh() {
    if (refreshPromise) {
      return refreshPromise;
    }

    if (!refreshTokenCookie.value) {
      clearAuth();
      throw new Error("Missing refresh token");
    }

    refreshPromise = (async () => {
      try {
        const response = await $fetch<AuthTokensResponse>("/auth/refresh", {
          baseURL: apiBase,
          method: "POST",
          body: { refreshToken: refreshTokenCookie.value }
        });
        persistTokens(response);
      } catch (error) {
        clearAuth();
        throw error;
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  }

  async function logout() {
    if (refreshTokenCookie.value) {
      await $fetch("/auth/logout", {
        baseURL: apiBase,
        method: "POST",
        body: { refreshToken: refreshTokenCookie.value }
      }).catch(() => undefined);
    }
    clearAuth();
  }

  function persistTokens(tokens: AuthTokensResponse) {
    accessToken.value = tokens.accessToken;
    accessTokenCookie.value = tokens.accessToken;
    accessTokenExpiresAt.value = tokens.accessTokenExpiresAt ? new Date(tokens.accessTokenExpiresAt).getTime() : null;
    if (accessTokenExpiresAt.value) {
      const seconds = Math.max(60, Math.floor((accessTokenExpiresAt.value - Date.now()) / 1000));
      accessTokenCookie.maxAge = seconds;
    }
    const refreshExpiry = tokens.refreshTokenExpiresAt ? new Date(tokens.refreshTokenExpiresAt).getTime() : null;
    refreshTokenCookie.value = tokens.refreshToken;
    if (refreshExpiry) {
      const seconds = Math.max(60, Math.floor((refreshExpiry - Date.now()) / 1000));
      refreshTokenCookie.maxAge = seconds;
    }
    hydrateUserFromToken(tokens.accessToken);
    scheduleTokenRefresh();
  }

  async function fetchProfile() {
    try {
      const profile = await $fetch<{ email: string; fullName: string; role: string }>("/auth/profile", {
        baseURL: apiBase,
        headers: authorizationHeader()
      });
      userEmail.value = profile.email;
      userName.value = profile.fullName;
      userRole.value = profile.role;
    } catch {
      // fallback to email claim from token in future enhancement
    }
  }

  function cancelScheduledRefresh() {
    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
      refreshTimeout = null;
    }
  }

  function scheduleTokenRefresh() {
    if (import.meta.server) {
      return;
    }
    cancelScheduledRefresh();
    if (!accessTokenExpiresAt.value) {
      return;
    }

    const delay = accessTokenExpiresAt.value - Date.now() - REFRESH_LEAD_TIME;
    if (delay <= 0) {
      refresh().catch(() => undefined);
      return;
    }

    refreshTimeout = setTimeout(() => {
      refresh().catch(() => undefined);
    }, delay);
  }

  function clearAuth() {
    cancelScheduledRefresh();
    accessToken.value = null;
    accessTokenCookie.value = null;
    accessTokenExpiresAt.value = null;
    refreshTokenCookie.value = null;
    userEmail.value = null;
    userName.value = null;
    userRole.value = null;
  }

  function hydrateUserFromToken(token: string | null) {
    if (!token) return;
    try {
      const base64 = token.split(".")[1] || "";
      const decoded = import.meta.server
        ? (globalThis.Buffer?.from(base64, "base64").toString("utf-8") ?? "")
        : atob(base64);
      const payload = JSON.parse(decoded);
      userEmail.value = payload.email ?? null;
      userName.value = payload.name ?? null;
      const roles = Array.isArray(payload.roles) ? payload.roles : [];
      userRole.value = roles[0]?.replace("ROLE_", "") ?? null;
      if (typeof payload.exp === "number") {
        accessTokenExpiresAt.value = payload.exp * 1000;
        scheduleTokenRefresh();
      }
    } catch {
      // ignore parsing errors
    }
  }

  function authorizationHeader(): Record<string, string> {
    return accessToken.value ? { Authorization: `Bearer ${accessToken.value}` } : {};
  }

  function normalizeError(error: any): Error {
    if (error?.status === 401) {
      return new Error("Invalid credentials or verification code.");
    }
    if (error?.data?.message) {
      return new Error(error.data.message);
    }
    return error instanceof Error ? error : new Error("Unexpected authentication error.");
  }

  return {
    login,
    logout,
    refresh,
    fetchProfile,
    isAuthenticated,
    authorizationHeader,
    accessToken,
    accessTokenExpiresAt,
    userEmail,
    userName,
    userRole
  };
}
