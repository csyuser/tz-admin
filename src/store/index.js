import Vue from 'vue'
import Vuex from 'vuex'
import 'element-ui/lib/theme-chalk/index.css';
// import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedMenu:'',
    cellStyle:{
      'font-size':'12px',
      'padding':'11px 0',
    },
    editDialogVisible:false,
    editDialogDisabled:true,
    deleteDialogVisible:false,
    departmentInfo: {},
    dialogType:'',
    selectedRow:[],
    page:1,
    pageSize:10,
  },
  mutations: {
    fetch(state){
      state.selectedMenu =  window.localStorage.getItem('selectedMenu')
    },
    // getPages(state,url){
    //   let TableDatas = {}
    //   axios.get(Vue.prototype.prefixAddr + url, {
    //     params: {
    //       page:state.page,
    //       pageSize:state.pageSize
    //     },
    //   }).then(res => {
    //     if (res.data.code.toString() === '200'){
    //       TableDatas = res.data
    //       console.log(TableDatas)
    //     }else {
    //       this.$message.error(res.data.msg)
    //     }
    //   })
    //     .catch()
    //   console.log(TableDatas)
    //   return TableDatas
    // },
    selectRow(state,val) {
      state.selectedRow = []
      val.forEach(item => {
        state.selectedRow.push(item)
      })
    },
    add(state){
      state.dialogType = 'add'
      state.departmentInfo = {}
      state.editDialogDisabled = false
      state.editDialogVisible = true
    },
    update(state) {
      state.dialogType = 'update'
      state.editDialogDisabled = false
      if (state.selectedRow.length === 1) {
        state.departmentInfo = this.selectedRow[0]
        state.editDialogVisible = true
      } else {
        this.$message.error('请选择一行数据')
      }
    },
    // confirmEdit(state) {
    //   state.editDialogVisible = false
    //   let editData = {}
    //   if (state.dialogType === 'add'){
    //     editData = state.departmentInfo
    //   }else if (state.dialogType === 'update'){editData = {id:state.selectedRow.id,...state.departmentInfo}}
    //   this.axios.post('/department/save',{...editData})
    //     .then(res=>{
    //       if (res.data.code.toString() === '200'){
    //         this.$message.success('保存成功')
    //         this.getPages()
    //       } else this.$message.error(res.data.msg)
    //     })
    //     .catch()
    // },
    // getPage(state,payload){
    //   const {url,page,pageSize} = payload
    //   this.axios.get(url, {
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
