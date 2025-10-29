import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_COZE_API_URL || 'https://api.coze.cn/v3',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 响应拦截器
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

export default http 