export function useAuthorizedFetch() {
  const auth = useAuth();
  const config = useRuntimeConfig();

  async function request<T>(url: string, options: any = {}, retry = true): Promise<T> {
    try {
      // Always get fresh authorization header at request time
      return await $fetch<T>(url, {
        baseURL: config.public.apiBase,
        headers: {
          ...auth.authorizationHeader(),
          ...(options.headers ?? {})
        },
        ...options
      });
    } catch (err: any) {
      if (retry && err?.status === 401) {
        try {
          // Refresh tokens - this will update the auth state
          await auth.refresh();
          // Retry the request - it will get the NEW token from authorizationHeader()
          return request<T>(url, options, false);
        } catch (refreshError) {
          // If refresh fails, logout and redirect
          await auth.logout();
          throw refreshError;
        }
      }
      throw err;
    }
  }

  return { request };
}
