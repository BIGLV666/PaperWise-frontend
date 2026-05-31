import axios from 'axios'

const request = axios.create({
  baseURL: '',  // 改成空字符串，让代理处理
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  console.log('请求地址：', config.url)  // 调试用
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器
request.interceptors.response.use(
  response => response.data,
  error => {
    console.error('请求失败：', error)
    return Promise.reject(error)
  }
)

export default request