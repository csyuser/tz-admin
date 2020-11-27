<template>
<div class="group-wrap">
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
  <Table  :colsHead="colsHead" :tableDatas="tableDatas" @add="add" @update="update" @postSelect="selectRow"
          @delete="deleteRows" @dblclick="view">
    <el-button size="small" class="update" @click="relatedUser"><SvgIcon icon-name="user"></SvgIcon>关联用户</el-button>
    <el-button size="small" class="update" @click="relatedPermission"><SvgIcon icon-name="permission"></SvgIcon>关联权限</el-button>
  </Table>
  <el-dialog title="添加小组" :visible.sync="editDialogVisible" width="970px">
    <el-form label-position="right" label-width="85px" :inline="true" :model="groupInfo" size="small"
             class="addForm"
             :disabled="editDialogDisabled">
      <el-form-item label="部门分类">
        <el-select v-model="groupInfo.className">
          <el-option label="激活" :value="true"></el-option>
          <el-option label="失效" :value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门名称">
        <el-input v-model="groupInfo.name" suffix-icon="xxx"></el-input>
      </el-form-item>
      <el-form-item label="部门编号">
        <el-input v-model="groupInfo.code" suffix-icon="xxx"></el-input>
      </el-form-item>
      <el-form-item label="部门级别">
        <el-input v-model="groupInfo.level" suffix-icon="xxx"></el-input>
      </el-form-item>
      <el-form-item label="上级部门">
        <el-select v-model="groupInfo.parentName">
          <el-option label="选用" :value="1"></el-option>
          <el-option label="禁用" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="行政区划">
        <el-input v-model="groupInfo.regionName" suffix-icon="xxx"></el-input>
      </el-form-item>
      <el-form-item label="选用标志">
        <el-select v-model="groupInfo.selection">
          <el-option label="选用" :value="1"></el-option>
          <el-option label="禁用" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="groupInfo.describe" suffix-icon="xxx"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="confirmEdit">确 定</el-button>
      </span>
  </el-dialog>
  <el-dialog title="删除小组" :visible.sync="deleteDialogVisible" width="650px">
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
import Table from '@/components/permission/Table'
import DeleteRow from '@/components/permission/DeleteRow'
import SvgIcon from '@/components/SvgIcon'

export default {
name: "Group",
  components:{Table,DeleteRow,SvgIcon},
  data(){
  return{
    formInline: {
      user: '',
      region: ''
    },
    colsHead: [{prop: 'NAME', label: '人员名称'}, {prop: 'CODE', label: '人员编码'}, {prop: 'ENTRY_TIME', label: '入职时间'},
      {prop: 'OUT_TIME', label: '离职时间'}, {prop: 'PHONE', label: '联系电话'}, {prop: 'EMAIL', label: '联系邮箱'},
      {prop: 'POST', label: '职务'}, {prop: 'SEX', label: '性别'}, {prop: 'ID_CARD', label: '身份证号码'},
      {prop: 'DEPARTMENT_ID', label: '所属部门id'}, {prop: 'VALID', label: '有效标志'}, {prop: 'RANK', label: '职级'}],
    tableDatas: {
      count: 30,
      tableData: [{
        id: 1,
        NAME: '韩梅梅',
        CODE: '333',
        ENTRY_TIME: '2016-05-02',
        OUT_TIME: '2016-05-02',
        PHONE: '11111111111',
        EMAIL: '11111111111@11.com',
        POST: 'JAVA',
        SEX: '女',
        ID_CARD: '210125413812314158',
        DEPARTMENT_ID: '22222',
        VALID: 'yes',
        RANK: 'L7',
      }, {
        id: 2,
        NAME: '韩梅梅',
        CODE: '333',
        ENTRY_TIME: '2016-05-02',
        OUT_TIME: '2016-05-02',
        PHONE: '11111111111',
        EMAIL: '11111111111@11.com',
        POST: 'JAVA',
        SEX: '女',
        ID_CARD: '210125413812314158',
        DEPARTMENT_ID: '22222',
        VALID: 'no',
        RANK: 'L7',
      }],
    },
    editDialogVisible: false,
    editDialogDisabled: false,
    deleteDialogVisible:false,
    selectedRow:[],
    groupInfo: {},
    transformData: [],
    value: [],
    filterMethod(query, item) {
      return item.label.indexOf(query) > -1
    },
    relatedTitle: '',
    relatedDialogVisible: false,
    userVal: [],
    permissionVal:[],
    transformType: '',
  }
  },
  methods:{
    //表格增删改查
    selectRow(val) {
      this.selectedRow = []
      val.forEach(item => {
        this.selectedRow.push(item)
      })
      console.log(this.selectedRow)
    },
    add() {
      this.groupInfo = {}
      this.editDialogDisabled = false
      this.editDialogVisible = true
    },
    update() {
      this.editDialogDisabled = false
      if (this.selectedRow.length === 1) {
        this.groupInfo = this.selectedRow[0]
        this.editDialogVisible = true
      } else {
        this.$message.error('请选择一行数据')
      }
    },
    confirmEdit(){
      this.editDialogVisible = false
    },
    view(row){
      this.groupInfo = row
      this.editDialogVisible = true
      this.editDialogDisabled = true
    },
    deleteRows() {
      if (this.selectedRow.length > 0) {
        this.deleteDialogVisible = true
      } else {
        this.$message.error('请选择至少一行数据')
      }
    },
    confirmDelete(){
      console.log('点击了')
      this.deleteDialogVisible = false
    },
//关联用户，权限
    relatedUser() {
      this.value = this.userVal
      this.transformType = 'user'
      this.relatedTitle = '关联用户'
      this.relatedDialogVisible = true
      this.transformData = [{label: '小组1', key: '小组1',}, {label: '小组2', key: '小组2'}, {label: '小组3', key: '小组3'},
        {label: '小组4', key: '小组4'}]
    },
    relatedPermission(){
      this.value = this.permissionVal
      this.transformType = 'permission'
      this.relatedTitle = '关联权限'
      this.relatedDialogVisible = true
      this.transformData =  [{label: '前端', key:'前端',},{label: '后端', key: '后端'}, {label: '测试', key: '测试'},
        {label: 'ui', key: 'ui'}]
    },
    confirmTransform(){
      this.relatedDialogVisible = false
      if (this.transformType === 'user'){
        this.userVal = this.value
      }else if (this.transformType === 'permission'){
        this.permissionVal= this.value
      }
      console.log(this.value)
    },
  }
}
</script>

<style scoped lang='scss'>
.group-wrap{
  padding: 20px;
}
</style>