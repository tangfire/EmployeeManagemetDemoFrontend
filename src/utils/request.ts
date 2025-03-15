import axios from 'axios'
import {message} from "antd";

const service = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 5000
})

// 请求拦截器 (添加 JWT)
service.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

service.interceptors.response.use(
    response => {
        const res = response.data
        // 统一处理业务错误（需与后端约定）
        if (res.code && res.code !== 200) {
            message.error(res.message || 'Error')
            return Promise.reject(res) // 传递完整错误对象
        }
        return res // 返回完整响应数据
    },
    error => {
        // 处理网络错误或 5xx 错误
        if (error.response?.status === 401) {
            window.location.href = '/'
        }
        const errMsg = error.response?.data?.message || error.message
        message.error(errMsg)
        return Promise.reject(error)
    }
)

export default service