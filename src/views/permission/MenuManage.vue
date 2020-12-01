<template>
  <div class="menu-manege-wrap">
    <el-form :inline="true" :model="formInline" class="demo-form-inline searchForm">
      <el-form-item>
        <el-input v-model="formInline.name" placeholder="菜单名称" size="small"></el-input>
      </el-form-item>
      <el-form-item class="selectInput">
        <el-select v-model="formInline['parentId']" placeholder="上级菜单" clearable size="small">
          <el-option :label="parentMenu.name" :value="parentMenu.id" v-for="parentMenu in parentMenus" :key="parentMenu.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" size="small">查询</el-button>
      </el-form-item>
    </el-form>
    <Table :colsHead="colsHead" :tableDatas="tableDatas" tableName="menu" @add="add" @update="update" @postSelect="selectRow"
           @currentChange="currentChange" @delete="deleteRow" @dblclick="viewPost"></Table>
    <el-dialog :title="dialogTitle" :visible.sync="editDialogVisible" width="650px">
      <el-form label-position="right" label-width="80px" ref="addForm" :inline="true" :model="menuInfo" size="small" class="addForm" :disabled="editDialogDisabled">
        <el-form-item label="菜单名称">
          <el-input v-model="menuInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort" :rules="{ type: 'number', message: '排序必须为数字值'}">
          <el-input v-model.number="menuInfo.sort" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" class="departmentItem">
          <el-select v-model="menuInfo.parentId">
            <el-option :label="parentMenu.name" :value="parentMenu.id" v-for="parentMenu in parentMenus" :key="parentMenu.id"></el-option>
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
      formInline:{},
      colsHead: [{prop: 'name', label: '菜单名称'}, {prop: 'sort', label: '排序'},
        {prop: 'parentName', label: '上级菜单'}, {prop: 'url', label: '菜单地址'},],
      tableDatas: {},
      selectedRow:[],
      // page:1,
      // pageSize:10,
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
      parentMenus: [],
    }
  },
  mounted() {
    this.getPages()
    this.getMenu()
  },
  methods:{
    getMenu(){
      this.axios.get(this.prefixAddr + '/dropList/selectMenu')
          .then(res => {
            if (res.data.code.toString() === '200') {
              this.parentMenus = res.data.data
            } else {this.parentMenus = []}
          })
          .catch()
    },
    getPages(formInline){
      this.axios.get(this.prefixAddr + '/menu/page', {
        params: {
          ...formInline
        },
      }).then(res => {
        if (res.data.code.toString() === '200'){
          this.tableDatas = res.data
          this.selectedRow = []
          this.getMenu()
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
    search(){
      this.getPages(this.formInline)
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
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          console.log('zhixingle')

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
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    viewPost(row){
      this.dialogTitle = '查看菜单'
      this.menuInfo = row
      this.editDialogVisible = true
      this.editDialogDisabled = true
    },
    deleteRow() {
      this.deleteIds = []
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