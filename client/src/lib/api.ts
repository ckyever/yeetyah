export interface ValidatorError {
  type: string;
  value: string;
  msg: string;
  path: string;
  location: string;
}

export interface ResponseData {
  user_id?: string;
  token?: string;
  message?: string;
  errors?: [ValidatorError];
}

export interface FetchResult {
  ok: boolean;
  data: ResponseData;
}

async function apiFetch(url: string, init: RequestInit): Promise<FetchResult> {
  const response = await fetch(url, init);
  return {
    ok: response.ok,
    data: await response.json(),
  };
}

export { apiFetch };
