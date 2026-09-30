/**
 * Centralized Request Client with intelligent retry mechanism and Dev logging:
 * - GET requests: Retry up to 3 times on failure
 * - Non-GET requests (POST, PUT, PATCH, DELETE): Retry up to 1 time on failure
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestOptions extends RequestInit {
  method?: HttpMethod;
  params?: Record<string, string | number | boolean | undefined>;
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
}

const isDev = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_APP_ENV !== 'production';

export class RequestClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl = '', defaultHeaders: Record<string, string> = {}) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = defaultHeaders;
  }

  /**
   * Determine max retries based on HTTP method:
   * GET -> 3 retries
   * Write methods (POST/PUT/PATCH/DELETE) -> 1 retry
   */
  public getMaxRetries(method: HttpMethod): number {
    return method === 'GET' ? 3 : 1;
  }

  /**
   * Helper delay for exponential backoff
   */
  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Executes any asynchronous operation (Supabase query, API call, etc.) with automatic retry policy and dev logging
   */
  public async executeWithRetry<T>(
    operationName: string,
    task: () => Promise<T>,
    method: HttpMethod = 'GET',
    customRetries?: number,
    baseDelayMs = 400
  ): Promise<T> {
    const maxRetries = customRetries !== undefined ? customRetries : this.getMaxRetries(method);
    let attempt = 0;
    let lastError: unknown = null;

    if (isDev) {
      console.log(`[Supabase ⚡ DEV] 🚀 Executing [${method}] "${operationName}"...`);
    }

    const overallStart = Date.now();

    while (attempt <= maxRetries) {
      const attemptStart = Date.now();
      try {
        if (attempt > 0) {
          console.log(`[RequestClient] 🔄 [Retry ${attempt}/${maxRetries}] Retrying [${method}] "${operationName}"...`);
        }
        const result = await task();
        const duration = Date.now() - attemptStart;

        if (isDev) {
          const countInfo = Array.isArray(result) ? ` (${result.length} items)` : '';
          console.log(`[Supabase ⚡ DEV] ✅ [${method}] "${operationName}" completed in [${duration}ms${countInfo}]`);
        }

        return result;
      } catch (error) {
        attempt++;
        lastError = error;
        const duration = Date.now() - attemptStart;
        const errorMessage = error instanceof Error ? error.message : String(error);

        console.warn(
          `[Supabase ⚡ DEV] ⚠️ [Attempt ${attempt}/${maxRetries + 1} Failed] [${method}] "${operationName}" (${duration}ms): ${errorMessage}`
        );

        if (attempt <= maxRetries) {
          const backoff = baseDelayMs * Math.pow(2, attempt - 1);
          await this.delay(backoff);
        }
      }
    }

    const totalDuration = Date.now() - overallStart;
    console.error(`[Supabase ⚡ DEV] ❌ All ${maxRetries + 1} attempts failed for [${method}] "${operationName}" (${totalDuration}ms).`);
    throw lastError instanceof Error ? lastError : new Error(String(lastError));
  }

  /**
   * Executes standard HTTP fetch with method-based retry mechanism
   */
  public async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const method = (options.method?.toUpperCase() as HttpMethod) || 'GET';
    const maxRetries = options.retries !== undefined ? options.retries : this.getMaxRetries(method);
    const retryDelayMs = options.retryDelayMs || 400;

    return this.executeWithRetry<T>(
      endpoint,
      async () => {
        const url = new URL(endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`);
        if (options.params) {
          Object.entries(options.params).forEach(([key, value]) => {
            if (value !== undefined) {
              url.searchParams.append(key, String(value));
            }
          });
        }

        const controller = new AbortController();
        const timeoutId = options.timeoutMs
          ? setTimeout(() => controller.abort(), options.timeoutMs)
          : null;

        try {
          const res = await fetch(url.toString(), {
            ...options,
            method,
            headers: {
              'Content-Type': 'application/json',
              ...this.defaultHeaders,
              ...options.headers,
            },
            signal: controller.signal,
          });

          if (!res.ok) {
            const errorText = await res.text().catch(() => '');
            throw new Error(`HTTP ${res.status} ${res.statusText}: ${errorText}`);
          }

          return (await res.json()) as T;
        } finally {
          if (timeoutId) clearTimeout(timeoutId);
        }
      },
      method,
      maxRetries,
      retryDelayMs
    );
  }

  public async get<T>(endpoint: string, options?: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public async post<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public async put<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public async delete<T>(endpoint: string, options?: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const requestClient = new RequestClient();
