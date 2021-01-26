// import Vue from 'vue'
// import axios from 'axios'
// import ElementUI from 'element-ui'
// import router from '@/router'
//
// const service = axios.create({
//   baseURL: getBseUrl()
// })
// function getBseUrl() {
//   return Vue.prototype.BASE_URL
// }
//
// let loading
// service.interceptors.request.use(function (config) {
//   let token = window.localStorage.getItem('token')
//   config.headers.common['Authorization'] = token ? token : ''
//   config.baseURL = getBseUrl()
//   loading = ElementUI.Loading.service({
//     lock: true,
//     background: 'rgba(255, 255, 255, 0.5)'
//   })
//   setTimeout(() => {
//     loading.close()
//   }, 10000)
//   return config
// }, function (error) {
//   return Promise.reject(error)
// })
// service.interceptors.response.use(function (response) {
//   if (response) {loading.close()}
//   if (response.data.code && response.data.code.toString() === '-200') {
//     if (router.currentRoute.name !== 'Login') {router.push('/')}
//   }
//   return response
// }, function (error) {
//   // 对响应错误做点什么
//   loading.close()
//   ElementUI.Message('请求出错')
//   return Promise.reject(error)
// })
//
// export default service