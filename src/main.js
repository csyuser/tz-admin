import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import './registerServiceWorker'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
Vue.use(VueAxios, axios)
Vue.config.productionTip = false

let startApp = function () {
  axios.get('/config.json').then((res) => {
    // 基础地址
    Vue.prototype.BASE_URL = res.data.BASE_URL
    Vue.prototype.wsUrl = res.data.wsUrl
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  })
}

function getBseUrl() {
  return Vue.prototype.BASE_URL
}

function LoginAgain() {
  router.beforeEach((to, from, next) => {
    if (from.name !== 'Login' && to.name === 'Login') next({name: 'Login'})
    else next()
  })
}

axios.interceptors.request.use(function (config) {
  let token = window.localStorage.getItem('token')
  config.headers.common['Authorization'] = token ? token : ''
  config.baseURL = getBseUrl()
  return config
}, function (error) {
  return Promise.reject(error)
})
axios.interceptors.response.use(function (response) {
  if (response.data.code && response.data.code.toString() === '-200') {
    LoginAgain()
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

startApp()

