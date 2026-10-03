import axios, { type AxiosRequestConfig } from "axios";
import type { z } from "zod";
export class ApiError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10_000,
});

// Normalise every failure into ApiError, so callers (and the retry rule) see one error type.
http.interceptors.response.use(undefined, (err: unknown) => {
  if (axios.isCancel(err)) throw err;
  if (axios.isAxiosError(err)) {
    const status = err.response?.status ?? 0; // 0 = network error or timeout (no response)    }
    const method = err.config?.method?.toUpperCase() ?? "GET";
    throw new ApiError(
      status,
      `${method} ${err.config?.url} failed: ${status || err.code}`,
    );
  }
  throw err;
});

export async function apiFetch<S extends z.ZodType>(
  path: string,
  schema: S,
  config?: AxiosRequestConfig,
): Promise<z.infer<S>> {
  const { data } = await http.request({ url: path, ...config });
  // FakeStore returns 200 with an empty body for unknown ids; axios gives us "" for that.
  if (data === "" || data == null) {
    throw new ApiError(404, `${config?.method ?? "GET"} ${path}: not found`);
  }
  return schema.parse(data);
}
