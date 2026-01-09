export interface OutletContext {
  userToken?: string | null;
  setUserToken?: (t: string) => void;
  user?: string | null;
  setUser?: (t: string) => void;
}
