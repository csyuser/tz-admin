import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedMenu:''
  },
  mutations: {
    fetch(state){
      state.selectedMenu =  window.localStorage.getItem('selectedMenu')
    },
  },
  actions: {
  },
  modules: {
  }
})
