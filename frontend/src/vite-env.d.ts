/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // Add more variables here if needed
  // readonly VITE_OTRA_VAR: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}