import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import './registerServiceWorker'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
Vue.use(VueAxios, axios)
Vue.config.productionTip = false

// Vue.prototype.prefixAddr = '';
// Vue.prototype.prefixAddr = '/api';
//  "BASE_URL": "http://192.168.99.132:8080/topcheer"

let startApp = function () {
  axios.get('/config.json').then((res) => {
    // 基础地址
    Vue.prototype.BASE_URL = res.data.BASE_URL;
    Vue.prototype.wsUrl = 'http://192.168.30.220:8080/topcheer'
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  })
}

function getBseUrl(){
  return Vue.prototype.BASE_URL
}

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.interceptors.request.use(function (config) {
  let token = window.localStorage.getItem('token');
  config.headers.common['Authorization'] = token ? 'Bearer'+' ' + token :'';
  config.baseURL = getBseUrl()
  return config;
}, function (error) {
  return Promise.reject(error);
});
axios.interceptors.response.use(function (response) {
  if (response.data.code && response.data.code.toString() === '-200'){
    ElementUI.Message.error('请重新登录')
    router.push('/')
  }
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

startApp()

