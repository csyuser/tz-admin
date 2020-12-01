<template>
  <div class="department-wrap">
    <el-form :inline="true" :model="formInline" class="demo-form-inline searchForm">
      <el-form-item>
        <el-input v-model="formInline.user" placeholder="输入名称或邮箱搜索" size="small"></el-input>
      </el-form-item>
      <el-form-item class="selectInput">
        <el-select v-model="formInline.region" placeholder="状态" size="small">
          <el-option label="激活" value="active"></el-option>
          <el-option label="失效" value="disabled"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small">查询</el-button>
      </el-form-item>
    </el-form>
    <Table :colsHead="colsHead" :tableDatas="tableDatas" :pageSize="pageSize" :page="page" @add="addDepartment" @update="updateDepartment"
           @postSelect="selectRow" @delete="deleteDepartment" @dblclick="viewDepartment" @currentChange="currentChange">
      <el-button size="small" class="update" @click="relatedUser"><SvgIcon icon-name="user"></SvgIcon>关联用户</el-button>
    </Table>
    <el-dialog :title="dialogTitle" :visible.sync="editDialogVisible" width="970px" :before-close="handleClose">
      <el-form label-position="right" label-width="85px" :inline="true" :model="departmentInfo" size="small"
               class="addForm"
               :disabled="editDialogDisabled">
        <el-form-item label="部门分类">
          <el-select v-model="departmentInfo.className">
            <el-option label="激活" :value="true"></el-option>
            <el-option label="失效" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门名称">
          <el-input v-model="departmentInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="部门编号">
          <el-input v-model="departmentInfo.code" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="部门级别">
          <el-input v-model="departmentInfo.level" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="上级部门" class="departmentItem">
          <el-input v-model="departmentInfo.parentName" readonly suffix-icon="xxx" @focus="focusDepartment" @blur="blurDepartment" ref="treeInput"></el-input>
          <el-tree :data="data" :props="defaultProps" @node-click="selectDepartment" class="tree" :class="{treeVisible}"
                   @node-expand="treeNode" @node-collapse="treeNode"></el-tree>
<!--          <span v-if="data.length<1">暂无数据</span>-->
        </el-form-item>
        <el-form-item label="行政区划">
          <el-input v-model="departmentInfo.regionName" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="选用标志">
          <el-select v-model="departmentInfo.selection">
            <el-option label="选用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="departmentInfo.describe" suffix-icon="xxx"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="confirmEdit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除部门" :visible.sync="deleteDialogVisible" width="650px" :before-close="handleClose">
      <DeleteRow @cancel="deleteDialogVisible = false" @confirm="confirmDelete"></DeleteRow>
    </el-dialog>
    <el-dialog :title="relatedTitle" :visible.sync="relatedDialogVisible" width="700px">
      <el-transfer
          filterable
          :filter-method="filterMethod"
          filter-placeholder="请输入"
          v-model="value"
          :data="transformData">
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="relatedDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="confirmTransform">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import Qs from 'qs'
import Table from '@/components/permission/Table'
import DeleteRow from '@/components/permission/DeleteRow'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'Department',
  components: {SvgIcon, Table, DeleteRow},
  data() {
    return {
      data: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      formInline: {
        user: '',
        region: ''
      },
      colsHead: [{prop: 'className', label: '部门分类'}, {prop: 'name', label: '部门名称'}, {prop: 'code', label: '部门编号'},
        {prop: 'level', label: '部门级别'}, {prop: 'parentName', label: '上级部门'}, {prop: 'regionName', label: '行政区划'},
        {prop: 'selection', label: '选用标志'}, {prop: 'describe', label: '描述'}],
      tableDatas: {},
      page:1,
      pageSize:10,
      dialogTitle:'',
      dialogType:'',
      editDialogVisible: false,
      deleteDialogVisible: false,
      editDialogDisabled: false,
      deleteIds: [],
      selectedRow: [],
      departmentInfo: {},
      transformData: [],
      value: [],
      filterMethod(query, item) {
        return item.label.indexOf(query) > -1
      },
      relatedTitle: '',
      relatedDialogVisible: false,
      userVal: [],
      transformType: '',
      treeVisible:false,
      isFocus:false,
    }
  },
  mounted() {
    this.getPages()
    this.axios.get(this.prefixAddr + '/department/selectDepartmentTree')
        .then(res=>{
          if (res.data.code.toString() === '200'){
            this.data = res.data.data
          }else {this.data = []}
        })
        .catch()
  },
  methods: {
    getPages(){
      this.axios.get(this.prefixAddr + '/department/page', {
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
//部门的增删改查
    selectRow(val) {
      this.selectedRow = []
      val.forEach(item => {
        this.selectedRow.push(item)
      })
    },
    addDepartment() {
      this.dialogType = 'add'
      this.dialogTitle = '新增部门'
      this.departmentInfo = {}
      this.editDialogDisabled = false
      this.editDialogVisible = true
    },
    updateDepartment() {
      this.dialogType = 'update'
      this.dialogTitle = '编辑部门信息'
      this.editDialogDisabled = false
      if (this.selectedRow.length === 1) {
        this.departmentInfo = this.selectedRow[0]
        this.editDialogVisible = true
      } else {
        this.$message.error('请选择一行数据')
      }
    },
    confirmEdit() {
      this.editDialogVisible = false
      let editData = {}
      if (this.dialogType === 'add'){
        editData = this.departmentInfo
      }else if (this.dialogType === 'update'){editData = {id:this.selectedRow.id,...this.departmentInfo}}
        this.axios.post(this.prefixAddr + '/department/save',{...editData})
            .then(res=>{
              if (res.data.code.toString() === '200'){
                this.$message.success('保存成功')
                this.getPages()
              } else this.$message.error(res.data.msg)
            })
            .catch()
    },
    viewDepartment(row) {
      this.dialogTitle = '查看部门信息'
      this.departmentInfo = row
      this.editDialogVisible = true
      this.editDialogDisabled = true
    },
    deleteDepartment() {
      if (this.selectedRow.length > 0) {
        this.deleteDialogVisible = true
        this.selectedRow.forEach(row=>{
          this.deleteIds.push(row.id)
        })
      } else {
        this.$message.error('请选择至少一行数据')
      }
    },
    confirmDelete() {
      this.deleteDialogVisible = false
      this.axios.post(this.prefixAddr + '/department/delete',{ids:this.deleteIds})
      .then(res=>{
        if (res.data.code.toString() === '200'){
          this.$message.success('删除成功')
          this.getPages()
        }else {this.$message.error(this.data.msg)}
        console.log(res)
      })
      .catch(error=>{this.$message.error('删除失败' + error)})
    },
//关联用户
    relatedUser() {
      if (this.selectedRow.length !== 1) {this.$message.error('请选择一行数据');return}
      this.value = this.userVal
      this.transformType = 'user'
      this.relatedTitle = '关联用户'
      this.relatedDialogVisible = true
      this.transformData = [{label: '小组1', key: '小组1',}, {label: '小组2', key: '小组2'}, {label: '小组3', key: '小组3'},
        {label: '小组4', key: '小组4'}]
    },
    confirmTransform() {
      this.relatedDialogVisible = false
      if (this.transformType === 'user') {
        this.userVal = this.value
      }
      console.log(this.value)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(() => {
            done()
          })
          .catch(() => {})
    },
//部门的数据下拉框
    treeNode(){
      this.isFocus = true
      this.treeVisible = true
      this.$refs.treeInput.focus()
    },
    focusDepartment(){
      this.treeVisible = true
    },
    blurDepartment(){
      this.isFocus = false
      setTimeout(()=>{
        if (this.isFocus !== true){
          this.treeVisible = false
        }
      },100)
    },
    selectDepartment(data) {
      this.treeVisible = false
        this.departmentInfo.parentName = data.name
      this.$refs.treeInput.blur()
    },
  }
}
</script>

<style scoped lang='scss'>
.department-wrap {
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
          min-height: 50px;
        }
        .treeVisible{
          display: block;
        }
      }


  }
}
</style>