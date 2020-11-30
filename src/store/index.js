import Vue from 'vue'
import Vuex from 'vuex'
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedMenu:'',
    cellStyle:{
      'font-size':'12px',
      'padding':'11px 0'
    },
  },
  mutations: {
    fetch(state){
      state.selectedMenu =  window.localStorage.getItem('selectedMenu')
    },
    // getPage(state,payload){
    //   const {url,page,pageSize} = payload
    //   this.axios.get(this.prefixAddr + url, {
    //     params: {page, pageSize}
    //   }).then(res => {
    //     console.log(res)
    //     return {a:'11',b:'22'}
    //   })
    //     .catch()
    // }
  },
  actions: {
  },
  modules: {
  }
})
