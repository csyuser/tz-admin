import Vue from 'vue'
import Vuex from 'vuex'
import 'element-ui/lib/theme-chalk/index.css';
// import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedMenu:[],
    userInfo:{},
    cellStyle:{
      'font-size':'12px',
      'padding':'11px 0',
    },
    // editDialogVisible:false,
    // editDialogDisabled:true,
    // deleteDialogVisible:false,
    // departmentInfo: {},
    // dialogType:'',
    // selectedRow:[],
    // page:1,
    // pageSize:10,
    isGetSocket:false,
    breadcrumb:[]
  },
  mutations: {
    fetch(state){
      let menu = window.localStorage.getItem('selectedMenu')
      state.selectedMenu = menu && JSON.parse(menu)
    },
    getUserInfo(state){
      state.userInfo =  JSON.parse(window.localStorage.getItem('userInfo'))
    },
    setSocket(state, type){
      state.isGetSocket = type
    },
    setBreadcrumb(state,list){
      state.breadcrumb = list
    }

    // selectRow(state,val) {
    //   state.selectedRow = []
    //   val.forEach(item => {
    //     state.selectedRow.push(item)
    //   })
    // },
    // add(state){
    //   state.dialogType = 'add'
    //   state.departmentInfo = {}
    //   state.editDialogDisabled = false
    //   state.editDialogVisible = true
    // },
    // update(state) {
    //   state.dialogType = 'update'
    //   state.editDialogDisabled = false
    //   if (state.selectedRow.length === 1) {
    //     state.departmentInfo = this.selectedRow[0]
    //     state.editDialogVisible = true
    //   } else {
    //     this.$message.error('请选择一行数据')
    //   }
    // },
  },
  actions: {
  },
  modules: {
  }
})
