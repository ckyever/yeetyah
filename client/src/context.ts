import * as api from "./lib/api";

export interface OutletContext {
  userToken: string | null;
  setUserToken: (t: string) => void;
  currentUser: api.User | null;
  setCurrentUser: (t: api.User) => void;
}
