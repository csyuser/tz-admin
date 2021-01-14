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

let loading
axios.interceptors.request.use(function (config) {
  let token = window.localStorage.getItem('token')
  config.headers.common['Authorization'] = token ? token : ''
  config.baseURL = getBseUrl()
  loading = ElementUI.Loading.service({
    lock: true,
    background: 'rgba(255, 255, 255, 0.5)'
  })
  setTimeout(() => {
    loading.close()
  }, 10000)
  return config
}, function (error) {
  return Promise.reject(error)
})
axios.interceptors.response.use(function (response) {
  if (response) {loading.close()}
  if (response.data.code && response.data.code.toString() === '-200') {
    if (router.currentRoute.name !== 'Login') {router.push('/')}
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  loading.close()
  ElementUI.Message('请求出错')
  return Promise.reject(error)
})

startApp()

