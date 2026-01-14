interface FetchResult {
  ok: boolean;
}

export interface MessageResult extends FetchResult {
  data: {
    messages: Message;
  };
}

export interface MessagesResult extends FetchResult {
  data: {
    messages: Message[];
  };
}

export interface Message {
  id: number | undefined;
  chat_id: number;
  text: string;
  timestamp: string;
  author_id: number;
  author: Author;
}

export interface Author {
  id: number | undefined;
  chat_id: number;
  user_id: number;
  user: User;
}

export interface UsersListResult extends FetchResult {
  data: {
    users: UsersListItem[];
  };
}

export interface ChatResult extends FetchResult {
  data: {
    chat: {
      name: string | null;
      id: number;
    };
  };
}

export interface UsersListItem {
  id: number;
  username: string;
  display_name: string;
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

export interface UserResult extends FetchResult {
  data: {
    user: User;
  };
}

export interface User {
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
