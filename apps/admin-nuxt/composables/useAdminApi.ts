import type { FetchOptions } from "ofetch";

type ApiErrorPayload = {
  field?: string | null;
  message: string;
};

type ApiResponseEnvelope<T> = {
  success: boolean;
  code: string;
  message: string;
  data: T;
  meta?: Record<string, any>;
  links?: Record<string, string>;
  errors?: ApiErrorPayload[] | null;
};

export function useAdminApi() {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase;
  const auth = useAuth();

  const authorizedRequest = async <T>(
    path: string,
    options: FetchOptions = {},
    retry = true
  ): Promise<T> => {
    try {
      const response = await $fetch<ApiResponseEnvelope<T>>(path, {
        baseURL,
        credentials: "include",
        headers: {
          ...auth.authorizationHeader(),
          ...(options.headers ?? {})
        },
        ...options
      });

      if (response && typeof response.success === "boolean") {
        if (!response.success) {
          const error = new Error(response.message || "Request failed");
          (error as any).code = response.code;
          (error as any).errors = response.errors;
          (error as any).data = response;
          throw error;
        }
        return response.data;
      }

      return response as unknown as T;
    } catch (error: any) {
      if (retry && error?.status === 401) {
        try {
          await auth.refresh();
          return await authorizedRequest<T>(path, options, false);
        } catch {
          await auth.logout();
        }
      }
      throw error;
    }
  };

  const fetcher = async <T>(
    path: string,
    fallback: T,
    options: FetchOptions = {}
  ): Promise<T> => {
    try {
      return await authorizedRequest<T>(path, options);
    } catch (error) {
      console.warn(
        `[admin-api] Falling back to mock data for "${path}" —`,
        (error as Error).message ?? error
      );
      return fallback;
    }
  };

  return { fetcher, request: authorizedRequest };
}
