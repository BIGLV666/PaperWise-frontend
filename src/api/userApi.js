import request from './request'

export const userApi = {
    // 登录
    login(username, password) {
        return request.post('/paperwise/user/login', null, {
            params: { username, password }
        })
    },
    
    // 注册（发送验证码） - 对应后端的 /register
    register(username, password, email) {
        console.log('注册请求参数：', { username, password, email })
        return request.post('/paperwise/user/register', null, {
            params: { username, password, email }
        })
    },
    
    // 激活（验证码注册） - 对应后端的 /activation
    activation(email, code) {
        console.log('激活请求参数：', { email, code })
        return request.post('/paperwise/user/activation', null, {
            params: { email, code }
        })
    }
}