import type { ApiResponse } from './api-response';

export class ApiClientError extends Error {
  constructor(
    public code: string,
    message: string,
    public status?: number
  ) {
    super(message);
  }
}

export async function apiFetch<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  let res: Response;

  try {
    res = await fetch(input, {
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {}),
      },
      ...init,
    });
  } catch {
    // network error
    throw new ApiClientError('NETWORK_ERROR', 'Cannot connect to server');
  }

  let json: ApiResponse<T>;

  try {
    json = await res.json();
  } catch {
    throw new ApiClientError(
      'INVALID_JSON',
      'Server returned invalid JSON',
      res.status
    );
  }

  if (!res.ok || !json.ok) {
    throw new ApiClientError(
      json.ok ? 'HTTP_ERROR' : json.error.code,
      json.ok ? res.statusText : json.error.message,
      res.status
    );
  }

  return json.data;
}
