import * as api from "./lib/api";

export interface OutletContext {
  userToken: string | null;
  setUserToken: (t: string) => void;
  user: api.User | null;
  setUser: (t: api.User) => void;
}
