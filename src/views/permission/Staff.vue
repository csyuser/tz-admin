<template>
  <div class="staff-wrap">
    <el-form :inline="true" :model="formInline" class="demo-form-inline searchForm">
      <el-form-item>
        <el-input v-model="formInline.name" placeholder="输入名称" size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" size="small">查询</el-button>
      </el-form-item>
    </el-form>
    <Table :colsHead="colsHead" :tableDatas="tableDatas" :pageSize="pageSize" :page="page" @currentChange="currentChange"
           @add="add" @update="update" @postSelect="selectRow"
           @delete="deleteRows" @dblclick="view"></Table>
    <el-dialog :title="dialogTitle" :visible.sync="editDialogVisible" width="970px" :before-close="handleClose">
      <el-form label-position="right" label-width="85px" :inline="true" :model="staffInfo" size="small" class="addForm"
               :disabled="editDialogDisabled">
        <el-form-item label="人员名称">
          <el-input v-model="staffInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="人员编码">
          <el-input v-model="staffInfo.code" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="职务">
          <el-select v-model="staffInfo.post">
            <el-option :label="item['dropName']" :value="item['id']" v-for="item in postDrop" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职级">
          <el-select v-model="staffInfo['rank']">
            <el-option :label="item['dropName']" :value="item['id']" v-for="item in rankDrop" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="staffInfo['sex']">
            <el-option label="女" :value="0"></el-option>
            <el-option label="男" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门" class="departmentItem">
          <el-input v-model="staffInfo.departmentName" readonly :suffix-icon="iconName" @focus="focusDepartment" @blur="blurDepartment" ref="treeInput"></el-input>
          <el-tree :data="data" :props="defaultProps" @node-click="selectDepartment" class="tree" :class="{treeVisible}"
                   @node-expand="treeNode" @node-collapse="treeNode"></el-tree>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="staffInfo.phone" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="联系邮箱">
          <el-input v-model="staffInfo.email" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码">
          <el-input v-model="staffInfo['idCard']" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="入职时间">
<!--          <el-input v-model="staffInfo.name" suffix-icon="xxx"></el-input>-->
          <el-date-picker v-model="staffInfo['entryTime']" type="date" placeholder="选择日期" style="width: 215px"></el-date-picker>
        </el-form-item>
        <el-form-item label="离职时间">
          <el-date-picker v-model="staffInfo['departureTime']" type="date" placeholder="选择日期" style="width: 215px"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="confirmEdit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除人员" :visible.sync="deleteDialogVisible" width="650px" :before-close="handleClose">
      <DeleteRow @cancel="deleteDialogVisible = false" @confirm="confirmDelete"></DeleteRow>
    </el-dialog>
  </div>
</template>

<script>
import Table from '@/components/permission/Table'
import DeleteRow from '@/components/permission/DeleteRow'
import {helper} from '@/views/method'
import {mixins} from '@/mixins/mixins'

export default {
  name: 'Staff',
  components: {Table,DeleteRow},
  mixins:[mixins],
  data() {
    return {
      page:1,
      pageSize:10,
      data: [],
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      formInline: {
        name: '',
      },
      colsHead: [{prop: 'name', label: '人员名称'}, {prop: 'code', label: '员工编码'}, {prop: 'post', label: '职务'},
        {prop: 'rank', label: '职级'}, {prop: 'sex', label: '性别'},{prop: 'departmentName', label: '部门名称'},{prop: 'phone', label: '电话'},
        {prop: 'email', label: '电子邮箱'}, {prop: 'idCard', label: '身份证号'}, {prop: 'entryTime', label: '入职时间'},{prop: 'departureTime', label: '离职时间'}],
      tableDatas: {},
      dialogType:'',
      dialogTitle:'',
      editDialogVisible: false,
      editDialogDisabled: false,
      deleteDialogVisible:false,
      deleteIds:[],
      selectedRow:[],
      staffInfo: {},
    }
  },
  mounted() {
    this.getPages()
    this.axios.get(this.prefixAddr + '/department/selectDepartmentTree')
        .then(res => {
          if (res.data.code.toString() === '200') {
            this.data = res.data.data
          } else {this.data = []}
        })
        .catch()
    this.getDropList('3')
    this.getDropList('7')
  },
  methods: {
    getPages(formInline){
      this.axios.get(this.prefixAddr + '/person/page', {
        params: {
          page:this.page,
          pageSize:this.pageSize,
          ...formInline
        },
      }).then(res => {
        if (res.data.code.toString() === '200'){
          this.tableDatas = res.data
          this.selectedRow = []
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
    search() {
      this. getPages(this.formInline)
    },
    add() {
      this.dialogType = 'add'
      this.dialogTitle = '添加人员'
      this.staffInfo = {}
      this.editDialogDisabled = false
      this.editDialogVisible = true
    },
    update() {
      this.dialogType = 'update'
      this.dialogTitle = '编辑人员信息'
      this.editDialogDisabled = false
      if (this.selectedRow.length === 1) {
        this.staffInfo = this.selectedRow[0]
        this.staffInfo.sex = helper.gender(this.selectedRow[0].sex)
        this.editDialogVisible = true
      } else {
        this.$message.error('请选择一行数据')
      }
    },
    confirmEdit(){
      this.editDialogVisible = false
      let editData = {}
      if (this.dialogType === 'add'){
        editData = this.staffInfo
      }else if (this.dialogType === 'update'){editData = {id:this.selectedRow.id,...this.staffInfo}}
      if (this.dialogType !== 'view'){
        this.axios.post(this.prefixAddr + '/person/save',{...editData})
            .then(res=>{
              if (res.data.code.toString() === '200'){
                this.$message.success('保存成功')
                this.getPages()
              } else this.$message.error(res.data.msg)
            })
            .catch()
      }
    },
    view(row){
      this.dialogType = 'view'
      this.dialogTitle = '查看人员信息'
      this.staffInfo = row
      this.staffInfo.sex = helper.gender(row.sex)
      this.editDialogVisible = true
      this.editDialogDisabled = true
    },
    deleteRows() {
      this.deleteIds = []
      if (this.selectedRow.length > 0) {
        this.deleteDialogVisible = true
        if (this.selectedRow.length > 0) {
          this.deleteDialogVisible = true
          this.selectedRow.forEach(row=>{
            this.deleteIds.push(row.id)
          })
        } else {
          this.$message.error('请选择至少一行数据')
        }
      } else {
        this.$message.error('请选择至少一行数据')
      }
    },
    confirmDelete(){
      this.deleteDialogVisible = false
      this.axios.post(this.prefixAddr + '/person/delete',{ids:this.deleteIds})
          .then(res=>{
            if (res.data.code.toString() === '200'){
              this.$message.success('删除成功')
              this.getPages()
            }else {this.$message.error(this.data.msg)}
            console.log(res)
          })
          .catch(error=>{this.$message.error('删除失败' + error)})
    },
//部门的数据下拉框
    treeNode(){
      this.nodeClick()
    },
    focusDepartment(){
      this.focusInput()
    },
    blurDepartment(){
      this.blurInput()
    },
    selectDepartment(data) {
      this.selectTree(data)
      this.staffInfo.departmentName = data.name
      this.staffInfo.departmentId = data.id
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(() => {
            done()
          })
          .catch(() => {})
    },

  }
}
</script>

<style scoped lang='scss'>
.staff-wrap {
  padding: 20px;

  > .searchForm {
    > .selectInput {
      width: 100px;
    }
  }
  .addForm {
    > .el-form-item {
      margin-bottom: 18px;
    }
    .departmentItem{
      position: relative;
      .tree{
        display: none;
        position: absolute;
        border: 1px solid #DCDFE6;
        padding-right: 10px;
        width: 215px;
        border-radius: 4px;
        margin-top: 5px;
        z-index: 999;
      }
      .treeVisible{
        display: block;
      }
    }

  }

}
</style>