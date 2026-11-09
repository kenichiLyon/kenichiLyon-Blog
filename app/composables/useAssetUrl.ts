export function useAssetUrl() {
  const base = useRuntimeConfig().app.baseURL;
  return (path: string) => /^(?:[a-z]+:|\/\/)/i.test(path) ? path : base.replace(/\/$/, '') + '/' + path.replace(/^\/+/, '');
}
