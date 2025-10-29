declare module '#supabase/server' {
  export * from '@nuxtjs/supabase'
}

declare module '~/stores/user' {
  export interface User {
    id: string
    email: string
    access_token?: string
  }
}

declare module 'h3' {
  export function defineEventHandler<T>(handler: (event: any) => Promise<T>): any
}

declare module 'nuxt/app' {
  export function navigateTo(to: string): Promise<void>
} 