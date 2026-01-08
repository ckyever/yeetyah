export interface AuthResult {
  ok: boolean;
  data: AuthData;
}

interface AuthData {
  user_id?: string;
  token?: string;
  message?: string;
  errors?: [ValidatorError];
}

export interface ValidatorError {
  type: string;
  value: string;
  msg: string;
  path: string;
  location: string;
}

async function apiFetch<T>(url: string, init: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  return {
    ok: response.ok,
    data: await response.json(),
  } as T;
}

export { apiFetch };
