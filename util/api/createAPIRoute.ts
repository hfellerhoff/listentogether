export type APIRoute = {
  get: () => string;
  withParams: (params: Record<string, string>) => string;
};

export const createAPIRoute = (url: string): APIRoute => ({
  get: () => url,
  withParams: (params: Record<string, string>) =>
    `${url}?${new URLSearchParams(params)}`,
});
