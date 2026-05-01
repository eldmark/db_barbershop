export type RouteHandler = (ctx?: unknown) => unknown | Promise<unknown>;

export type RouteApp = {
  get: (path: string, handler?: RouteHandler) => unknown;
  post: (path: string, handler?: RouteHandler) => unknown;
  put: (path: string, handler?: RouteHandler) => unknown;
  delete: (path: string, handler?: RouteHandler) => unknown;
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