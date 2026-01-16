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
    // Если сервер вернул свой error с кодом — используем его
    const code = !json.ok ? json.error.code : 'HTTP_ERROR';
    const message = !json.ok ? json.error.message : res.statusText;

    throw new ApiClientError(code, message, res.status);
  }

  return json.data;
}
