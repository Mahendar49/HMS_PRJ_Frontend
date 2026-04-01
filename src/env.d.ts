/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USER_REGISTER_API: string;
  // add more env vars here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}