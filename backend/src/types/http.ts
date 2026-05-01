export type RouteApp = {
  get: (...args: unknown[]) => unknown;
  post: (...args: unknown[]) => unknown;
  put: (...args: unknown[]) => unknown;
  delete: (...args: unknown[]) => unknown;
};

export type IdParams = {
  id: string;
};

export type UserIdParams = {
  userId: string;
};

export type RouteHeaders = Record<string, string | undefined>;

export type RouteContext<P extends object = Record<string, never>, B = unknown> = {
  params: P;
  body: B;
  headers?: RouteHeaders;
  request?: {
    headers?: RouteHeaders;
  };
};