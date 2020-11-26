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


// let token = window.localStorage.getItem('token');
// axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
Vue.prototype.prefixAddr = 'http://192.168.99.132:8080/topcheer';
// Vue.prototype.prefixAddr = '/api';

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
