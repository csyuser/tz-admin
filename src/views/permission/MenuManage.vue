<template>
  <div class="menu-manege-wrap">
    <el-form :inline="true" :model="menuInfo" class="demo-form-inline searchForm">
      <el-form-item>
        <el-input v-model="menuInfo.name" placeholder="菜单名称" size="small"></el-input>
      </el-form-item>
      <el-form-item class="selectInput">
        <el-select v-model="menuInfo.previousMenu" placeholder="上级菜单" size="small">
          <el-option label="激活" value="active"></el-option>
          <el-option label="失效" value="disabled"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="selectInput">
        <el-select v-model="menuInfo.menuType" placeholder="菜单类型" size="small">
          <el-option label="激活" value="active"></el-option>
          <el-option label="失效" value="disabled"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit" size="small">查询</el-button>
      </el-form-item>
    </el-form>
    <Table :colsHead="colsHead" :tableDatas="tableDatas" @add="add" @update="update" @postSelect="selectRow"
           @currentChange="currentChange" @delete="deleteRow" @dblclick="viewPost"></Table>
    <el-dialog :title="dialogTitle" :visible.sync="editDialogVisible" width="650px">
      <el-form label-position="right" label-width="80px" :inline="true" :model="menuInfo" size="small" class="addForm" :disabled="editDialogDisabled">
        <el-form-item label="菜单名称">
          <el-input v-model="menuInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="menuInfo.sort" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-select v-model="menuInfo.parentId">
            <el-option label="权限管理" value="1"></el-option>
            <el-option label="其他" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单地址">
          <el-input v-model="menuInfo.url" suffix-icon="xxx"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="confirmEdit" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除菜单" :visible.sync="deleteDialogVisible" width="650px">
      <DeleteRow @cancel="deleteDialogVisible = false" @confirm="confirmDelete"></DeleteRow>
    </el-dialog>
  </div>
</template>

<script>
import Table from '@/components/permission/Table'
import DeleteRow from '@/components/permission/DeleteRow'
export default {
  name: 'MenuManage',
  components:{Table,DeleteRow},
  data(){
    return{
      formInline:{
        name:'',
        previousMenu:'',
        menuType:''
      },
      colsHead: [{prop: 'name', label: '菜单名称'}, {prop: 'sort', label: '排序'},
        {prop: 'parentId', label: '上级菜单'}, {prop: 'url', label: '菜单地址'},],
      tableDatas: {
        count: 30,
        data: [{
          id: 1,
          name:'权限管理',
          sort:'1',
          parentId:'',
          url:'',
          children:[{
            id: '1-1',
            name:'用户管理',
            sort:'1',
            parentId:'权限管理',
            url:'/MenuManage',
          },{
            id: 1-2,
            name:'岗位管理',
            sort:'2',
            parentId:'权限管理',
            url:'/MenuManage',
          },{
            id: '1-4',
            name:'菜单管理',
            sort:'3',
            parentId:'权限管理',
            url:'/MenuManage',
          }]
        },  {
          id: 4,
          name:'其他',
          sort:'4',
          parentId:'',
          url:'/MenuManage',
          children:[{
            id: '2-1',
            name:'用户管理',
            sort:'1',
            parentId:'其他',
            url:'/MenuManage',
          }]
        },{
          id: 5,
          name:'其他1',
          sort:'5',
          parentId:'',
          url:'/MenuManage',
        }],
      },
      selectedRow:[],
      page:1,
      pageSize:10,
      dialogType:'',
      dialogTitle:'',
      editDialogVisible: false,
      deleteDialogVisible: false,
      editDialogDisabled:false,
      deleteIds:[],
      menuInfo: {
        name: '',
        sort: '',
        parentId: '',
        url: ''
      },
    }
  },
  mounted() {
    this.getPages()
  },
  methods:{
    submit(){
      console.log(this.menuInfo)
    },
    getPages(){
      this.axios.get(this.prefixAddr + '/menu/page', {
        params: {
          page:this.page,
          pageSize:this.pageSize
        },
      }).then(res => {
        if (res.data.code.toString() === '200'){
          this.tableDatas = res.data
        }else {
          this.$message.error(res.data.msg)
        }
      })
          .catch()
    },
    currentChange(val,row){
      this.page = val
      this.selectedRow = row
      this.deleteIds = []
      this.getPages()
    },
//表格增删改查
    selectRow(val) {
      this.selectedRow = []
      val.forEach(item => {
        this.selectedRow.push(item)
      })
      console.log(this.selectedRow)
    },
    add() {
      this.dialogType = 'add'
      this.dialogTitle = '增加菜单'
      this.menuInfo = {}
      this.editDialogDisabled = false
      this.editDialogVisible = true
    },
    update() {
      this.dialogType = 'update'
      this.dialogTitle = '编辑菜单'
      this.editDialogDisabled = false
      if (this.selectedRow.length === 1) {
        this.menuInfo = this.selectedRow[0]
        this.editDialogVisible = true
      } else {
        this.$message.error('请选择一行数据')
      }
    },
    confirmEdit(){
      this.editDialogVisible = false
      let editData = {}
      if (this.dialogType === 'add'){
        editData = this.menuInfo
      }else if (this.dialogType === 'update'){editData = {id:this.selectedRow.id,...this.menuInfo}}
      console.log('editData')
      console.log(editData)
      this.axios.post(this.prefixAddr + '/menu/save',{...editData})
          .then(res=>{
            if (res.data.code.toString() === '200'){
              this.$message.success('保存成功')
              this.getPages()
            } else this.$message.error(res.data.msg)
          })
          .catch()
    },
    viewPost(row){
      this.dialogTitle = '查看菜单'
      this.menuInfo = row
      this.editDialogVisible = true
      this.editDialogDisabled = true
    },
    deleteRow() {
      if (this.selectedRow.length > 0) {
        this.deleteDialogVisible = true
        this.selectedRow.forEach(row=>{
          this.deleteIds.push(row.id)
        })
      } else {
        this.$message.error('请选择至少一行数据')
      }
    },
    confirmDelete(){
      this.deleteDialogVisible = false
      this.axios.post(this.prefixAddr + '/menu/delete',{ids:this.deleteIds})
          .then(res=>{
            if (res.data.code.toString() === '200'){
              this.$message.success('删除成功')
              this.getPages(this.page,this.pageSize)
            }else {this.$message.error(this.data.msg)}
            console.log(res)
          })
          .catch(error=>{this.$message.error('删除失败' + error)})
    },
  }
}
</script>

<style scoped lang='scss'>
.menu-manege-wrap{
  padding: 20px;
  > .searchForm {
    > .selectInput {
      width: 150px;
    }
  }
}

</style>