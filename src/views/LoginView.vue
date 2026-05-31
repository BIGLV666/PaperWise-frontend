<template>
  <div class="login-container">
    <div class="login-card">
      <h2>📚 PaperWise</h2>
      <h3>登录</h3>
      
      <div>
        <el-input 
          type="text" 
          v-model="form.username" 
          placeholder="用户名"
          class="input"
        />
      </div>
      
      <div >
        <el-input 
          type="password" 
          v-model="form.password" 
          placeholder="密码"
          class="input"
          @keyup.enter="handleLogin"
        />
      </div>
      
      <el-button 
        @click="handleLogin" 
        :disabled="loading"
        class="login-btn"
      >
        {{ loading ? '登录中...' : '登录' }}
      </el-button>
      
      <div class="register-link">
        <a @click="showForgotPassword = true">忘记密码？</a>

            还没有账号？
        <a @click="showRegister = true">立即注册</a>
     </div>
    </div>
  </div>

  <!-- 注册弹窗 -->
  <div v-if="showRegister" class="modal">
    <div class="modal-content">
      <h3>注册</h3>
      
      <div class="form-group">
        <el-input 
          type="text" 
          v-model="registerForm.username" 
          placeholder="用户名"
          class="input"
        />
      </div>
      
      <div class="form-group">
        <el-input 
          type="password" 
          v-model="registerForm.password" 
          placeholder="密码"
          class="input"
        />
      </div>
      
      <div class="form-group">
        <div style="display: flex; gap: 10px;">
          <el-input 
            type="email" 
            v-model="registerForm.email" 
            placeholder="邮箱"
            class="input"
            style="flex: 1;"
          />
          <el-button 
            @click="sendCode" 
            :disabled="codeDisabled"
            class="code-btn"
          >
            {{ codeButtonText }}
          </el-button>
        </div>
      </div>
      
      <div class="form-group">
        <el-input 
          type="text" 
          v-model="registerForm.code" 
          placeholder="验证码"
          class="input"
        />
      </div>
      
      <div class="modal-buttons">
        <el-button @click="showRegister = false" class="cancel-btn">取消</el-button>
        <el-button @click="register" class="register-btn">注册</el-button>
      </div>
    </div>
  </div>
 

</template>
<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { userApi } from '@/api/userApi'

const router = useRouter()
const loading = ref(false)
const showRegister = ref(false)

// 验证码相关
const codeDisabled = ref(false)
const codeSending = ref(false)
const countdown = ref(0)

const codeButtonText = computed(() => {
  if (countdown.value > 0) {
    return `${countdown.value}秒后重试`
  }
  return '发送验证码'
})

// 登录表单
const form = reactive({
  username: '',
  password: ''
})

// 注册表单
const registerForm = reactive({
  username: '',
  password: '',
  email: '',
  code: ''
})

// 发送验证码（预注册）
const sendCode = async () => {
  if (!registerForm.username || !registerForm.password) {
    alert('请先输入用户名和密码')
    return
  }
  if (!registerForm.email) {
    alert('请输入邮箱')
    return
  }
  
  codeSending.value = true
  try {
    const res = await userApi.register(
      registerForm.username,
      registerForm.password,
      registerForm.email
    )
    console.log(res)
    if (res.code === 200) {
      alert('验证码已发送')
      countdown.value = 60
      codeDisabled.value = true
      const timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(timer)
          codeDisabled.value = false
        }
      }, 1000)
    } else {
      alert(res.message || '发送失败')
    }
  } catch (error) {
    alert(error.response?.data?.message || '发送失败')
  } finally {
    codeSending.value = false
  }
}

// 登录
const handleLogin = async () => {
  if (!form.username || !form.password) {
    alert('请输入用户名和密码')
    return
  }
  
  loading.value = true
  try {
    const res = await userApi.login(form.username, form.password)
    console.log('登录响应：', res)
    
    if (res.code === 200) {
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('userid', res.data.userid)
      localStorage.setItem('username', res.data.username)
      
      alert('登录成功')
      router.push('/review')
    } else {
      alert(res.message || '登录失败')
    }
  } catch (error) {
    console.error('登录错误：', error)
    alert('登录失败，请检查用户名密码')
  } finally {
    loading.value = false
  }
}

// 注册（激活）
const register = async () => {
  if (!registerForm.username || !registerForm.password || !registerForm.email) {
    alert('请填写完整信息')
    return
  }
  if (!registerForm.code) {
    alert('请输入验证码')
    return
  }
  
  try {
    const res = await userApi.activation(registerForm.email, registerForm.code)
    
    if (res.code === 200) {
      alert('注册成功，请登录')
      showRegister.value = false
      registerForm.username = ''
      registerForm.password = ''
      registerForm.email = ''
      registerForm.code = ''
    } else {
      alert(res.message || '激活失败')
    }
  } catch (error) {
    alert(error.response?.data?.message || '激活失败')
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.login-card h2 {
  text-align: center;
  margin-bottom: 10px;
  color: #333;
}

.login-card h3 {
  text-align: center;
  margin-bottom: 30px;
  color: #666;
  font-weight: normal;
}

.form-group {
  margin-bottom: 20px;
}

.input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
}

.input:focus {
  outline: none;
  border-color: #667eea;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

.login-btn:hover {
  background: #5a67d8;
}

.login-btn:disabled {
  background: #999;
  cursor: not-allowed;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.register-link a {
  color: #667eea;
  cursor: pointer;
}

.register-link a:hover {
  text-decoration: underline;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  width: 400px;
  padding: 30px;
  background: white;
  border-radius: 16px;
}

.modal-content h3 {
  text-align: center;
  margin-bottom: 20px;
}

.modal-buttons {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 20px;
}

.cancel-btn, .register-btn, .code-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.cancel-btn {
  background: #ddd;
}

.register-btn {
  background: #667eea;
  color: white;
}

.code-btn {
  background: #667eea;
  color: white;
  white-space: nowrap;
}

.code-btn:disabled {
  background: #999;
  cursor: not-allowed;
}
</style>