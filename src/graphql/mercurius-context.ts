import type { EmployeeLoaders } from '../modules/employees/graphql/employees.loaders'

declare module 'mercurius' {
  interface MercuriusContext {
    loaders: EmployeeLoaders
  }
}

// export {} supaya file ini dianggap module oleh TS (bukan ambient script),
// wajib ada kalau file cuma isi `declare module` tanpa import/export lain.
export {}