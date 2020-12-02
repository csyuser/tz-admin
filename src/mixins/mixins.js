export const mixins = {
  data(){
    return{
      page: 1,
      pageSize: 10,
      tableDatas: {},
      dialogTitle: '',
      dialogType: '',
      deleteIds: [],
      editDialogVisible: false,
      editDialogDisabled: false,
      deleteDialogVisible: false,
      selectedRow: [],
      editFormInfo: {},
      searchData:{},
      treeVisible:false,
      isFocus:false,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
    }
  },
  methods:{
    getPages(url,formInline) {
      this.axios.get(this.prefixAddr + url, {
        params: {
          page: this.page,
          pageSize: this.pageSize,
          ...formInline
        },
      }).then(res => {
        if (res.data.code.toString() === '200') {
          this.tableDatas = res.data
          this.selectedRow = []
        } else {
          this.$message.error(res.data.msg)
        }
      })
        .catch()
    },
    currentPageChange(val, row,url) {
      this.page = val
      this.selectedRow = row
      this.deleteIds = []
      this.getPages(url)
    },
//表格增删改查
    selectedRows(val) {
      this.selectedRow = []
      val.forEach(item => {
        this.selectedRow.push(item)
      })
    },
    searchRow(pageUrl) {
      this.getPages(pageUrl,this.searchData)
    },
    addRow() {
      this.dialogType = 'add'
      this.editFormInfo = {}
      this.editDialogDisabled = false
      this.editDialogVisible = true
    },
    updateRow() {
      this.dialogType = 'update'
      this.editDialogDisabled = false
      if (this.selectedRow.length === 1) {
        this.editFormInfo = this.selectedRow[0]
        this.editFormInfo.sort = this.selectedRow[0].sort && parseInt(this.selectedRow[0].sort)
        this.editDialogVisible = true
      } else {
        this.$message.error('请选择一行数据')
      }
    },
    confirmEditRow(saveUrl,pageUrl) {
          this.editDialogVisible = false
          let editData = {}
          if (this.dialogType === 'add') {
            editData = this.editFormInfo
          } else if (this.dialogType === 'update') {editData = {id: this.selectedRow.id, ...this.editFormInfo}}
          if (this.dialogType !== 'view') {
            this.axios.post(this.prefixAddr + saveUrl, {...editData})
              .then(res => {
                if (res.data.code.toString() === '200') {
                  this.$message.success('保存成功')
                  this.getPages(pageUrl)
                } else this.$message.error(res.data.msg)
              })
              .catch()
          }
    },
    viewRow(row) {
      this.dialogType = 'view'
      this.editFormInfo = row
      this.editDialogVisible = true
      this.editDialogDisabled = true
    },
    deleteRow() {
      this.deleteIds = []
      if (this.selectedRow.length > 0) {
        this.deleteDialogVisible = true
        this.selectedRow.forEach(row => {
          this.deleteIds.push(row.id)
        })
      } else {
        this.$message.error('请选择至少一行数据')
      }
    },
    confirmDeleteRow(deleteUrl,pageUrl) {
      this.deleteDialogVisible = false
      this.axios.post(this.prefixAddr + deleteUrl, {ids: this.deleteIds})
        .then(res => {
          if (res.data.code.toString() === '200') {
            this.$message.success('删除成功')
            this.getPages(pageUrl)
          } else {this.$message.error(this.data.msg)}
        })
        .catch(error => {this.$message.error('删除失败' + error)})
    },
//数据下拉树
    nodeClick(){
      this.isFocus = true
      this.treeVisible = true
      this.$refs.treeInput.focus()
    },
    focusInput(){
      this.treeVisible = true
    },
    blurInput(){
      this.isFocus = false
      setTimeout(()=>{
        if (this.isFocus !== true){
          this.treeVisible = false
        }
      },100)
    },
    selectTree(data) {
      console.log(data);
      this.treeVisible = false
    },
  },
}