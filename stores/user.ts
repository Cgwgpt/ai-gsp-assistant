import { defineStore } from 'pinia'
import { useSupabaseClient } from '#supabase/client'
import type { User } from '@supabase/supabase-js'

interface UserState {
  user: User | null
  loading: boolean
  error: string | null
  session: any | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    loading: false,
    error: null,
    session: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userEmail: (state) => state.user?.email,
    accessToken: (state) => state.session?.access_token
  },

  actions: {
    async login(email: string, password: string) {
      this.loading = true
      this.error = null
      
      try {
        const client = useSupabaseClient()
        const { data, error } = await client.auth.signInWithPassword({
          email,
          password
        })
        
        if (error) throw error
        this.user = data.user
        this.session = data.session
      } catch (err: any) {
        this.error = err.message || '登录失败'
        throw err
      } finally {
        this.loading = false
      }
    },

    async logout() {
      const client = useSupabaseClient()
      await client.auth.signOut()
      this.user = null
      this.session = null
    }
  }
}) 