export function useAuthorizedFetch() {
  const auth = useAuth();
  const config = useRuntimeConfig();

  async function request<T>(url: string, options: any = {}, retry = true): Promise<T> {
    try {
      return await $fetch<T>(url, {
        baseURL: config.public.apiBase,
        headers: auth.authorizationHeader(),
        ...options
      });
    } catch (err: any) {
      if (retry && err?.status === 401) {
        await auth.refresh();
        return request<T>(url, options, false);
      }
      throw err;
    }
  }

  return { request };
}
