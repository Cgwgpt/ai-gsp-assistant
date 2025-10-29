import axios from 'axios'
import { useUserStore } from '../stores/user'
import { navigateTo } from 'nuxt/app'
import type { InternalAxiosRequestConfig } from 'axios'

const http = axios.create({
  baseURL: '/api',
  timeout: 10000
})

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const userStore = useUserStore()
  if (userStore.isAuthenticated && config.headers) {
    config.headers['Authorization'] = `Bearer ${userStore.accessToken}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const userStore = useUserStore()
      await userStore.logout()
      navigateTo('/login')
    }
    return Promise.reject(error)
  }
)

export default http 