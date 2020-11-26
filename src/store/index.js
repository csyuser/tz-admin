import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedMenu:'',
    cellStyle:{
      'font-size':'12px',
      'padding':'11px 0'
    },
    token:''
  },
  mutations: {
    fetch(state){
      state.selectedMenu =  window.localStorage.getItem('selectedMenu')
    },
    getToken(state){
      state.token =  window.localStorage.getItem('token')
    },
  },
  actions: {
  },
  modules: {
  }
})
