export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export class ApiError extends Error {
  code: string;
  status: number;
  details?: unknown;

  constructor(code: string, message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: unknown };
}

async function toApiError(response: Response): Promise<ApiError> {
  let envelope: ApiEnvelope<unknown> | null = null;
  try {
    envelope = await response.json();
  } catch {
    envelope = null;
  }
  if (envelope?.error) {
    return new ApiError(envelope.error.code, envelope.error.message, response.status, envelope.error.details);
  }
  return new ApiError('REQUEST_FAILED', `Request failed with status ${response.status}`, response.status);
}

export async function apiRequest<T>(path: string, options: RequestInit = {}, allowRefresh = true): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      credentials: 'include',
      ...options,
    });
  } catch (err) {
    throw new ApiError(
      'NETWORK_ERROR',
      `Unable to connect to CRM API (${API_BASE_URL}). Is the API server running on port 3001?`,
      0,
      err instanceof Error ? err.message : String(err)
    );
  }

  if (response.status === 401 && allowRefresh && !path.startsWith('/auth/')) {
    const refreshed = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (refreshed.ok) {
      return apiRequest<T>(path, options, false);
    }
  }

  if (response.status === 204) {
    return undefined as T;
  }

  let envelope: ApiEnvelope<T> | null = null;
  try {
    envelope = await response.json();
  } catch {
    envelope = null;
  }

  if (!response.ok || !envelope?.success) {
    throw await toApiError(response);
  }

  return envelope.data as T;
}

export const api = {
  get: <T>(path: string) => apiRequest<T>(path),
  post: <T>(path: string, body?: unknown) => {
    const hasBody = body !== undefined;
    return apiRequest<T>(path, {
      method: 'POST',
      ...(hasBody ? { headers: { 'Content-Type': 'application/json' } } : {}),
      body: hasBody ? JSON.stringify(body) : undefined,
    });
  },
  put: <T>(path: string, body?: unknown) => {
    const hasBody = body !== undefined;
    return apiRequest<T>(path, {
      method: 'PUT',
      ...(hasBody ? { headers: { 'Content-Type': 'application/json' } } : {}),
      body: hasBody ? JSON.stringify(body) : undefined,
    });
  },
  delete: <T>(path: string) => apiRequest<T>(path, { method: 'DELETE' }),
};

export interface AuthUserPayload {
  userId: string;
  email: string;
  full_name: string;
  role: string;
  organizationId: string;
  employeeId: string;
  crmRole: string;
  isSuperior: boolean;
}

export const authApi = {
  async login(email: string, password: string): Promise<AuthUserPayload> {
    const data = await api.post<{ user: AuthUserPayload }>('/auth/login', { email, password });
    return data.user;
  },
  async register(payload: {
    email: string;
    password: string;
    fullName: string;
    employeeId: string;
    designation: string;
    department: string;
    joiningDate: string;
  }): Promise<AuthUserPayload> {
    const data = await api.post<{ user: AuthUserPayload }>('/auth/register', payload);
    return data.user;
  },
  async me(): Promise<AuthUserPayload> {
    const data = await api.get<{ user: AuthUserPayload }>('/auth/me');
    return data.user;
  },
  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },
};
