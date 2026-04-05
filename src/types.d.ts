declare module '/legacy/index.js'

interface ImportMetaEnv {
  readonly VITE_KIE_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
