interface FetchResult {
  ok: boolean;
}

export interface UsernameResult extends FetchResult {
  data: {
    username: string;
    is_available: true;
  };
}

export interface AuthResult extends FetchResult {
  data: AuthData;
}

interface AuthData {
  user?: User;
  token?: string;
  message?: string;
  errors?: [ValidatorError];
}

interface User {
  username: string;
  password: string;
  display_name?: string;
  profile_image?: string;
  is_logged_in: boolean;
  id: number;
}

export interface ValidatorError {
  type: string;
  value: string;
  msg: string;
  path: string;
  location: string;
}

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  return {
    ok: response.ok,
    data: await response.json(),
  } as T;
}

export { apiFetch };
