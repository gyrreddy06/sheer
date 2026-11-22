/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_EMERGENCY_HELPLINE_HYD?: string;
  readonly VITE_TELEMANAS_HELPLINE?: string;
  readonly VITE_WOMEN_HELPLINE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
