// <reference types=vite/client />

// Without this, ImportMetaEnv also has , so a typo type-checks fine.
interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

// Every VITE_ variable the app reads. A typo like VITE_API_ULR now fails the type check.
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
