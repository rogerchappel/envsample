export function config() {
  return {
    databaseUrl: process.env.DATABASE_URL,
    apiBase: process.env["PUBLIC_API_BASE"],
    viteFlag: import.meta.env.VITE_FEATURE_FLAG
  };
}
