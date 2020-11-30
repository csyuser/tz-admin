<template>
  <div class="staff-wrap">
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
        <el-button type="primary" @click="onSubmit" size="small">查询</el-button>
      </el-form-item>
    </el-form>
    <Table :colsHead="colsHead" :tableDatas="tableDatas" @add="add" @update="update" @postSelect="selectRow"
           @delete="deleteRows" @dblclick="view"></Table>
    <el-dialog title="添加岗位" :visible.sync="editDialogVisible" width="970px" :before-close="handleClose">
      <el-form label-position="right" label-width="85px" :inline="true" :model="staffInfo" size="small" class="addForm"
               :disabled="editDialogDisabled">
        <el-form-item label="人员名称">
          <el-input v-model="staffInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="人员编码">
          <el-input v-model="staffInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="入职时间">
<!--          <el-input v-model="staffInfo.name" suffix-icon="xxx"></el-input>-->
          <el-date-picker v-model="staffInfo.name" type="date" placeholder="选择日期" style="width: 215px"></el-date-picker>
        </el-form-item>
        <el-form-item label="离职时间">
          <el-date-picker v-model="staffInfo.name" type="date" placeholder="选择日期" style="width: 215px"></el-date-picker>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="staffInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="联系邮箱">
          <el-input v-model="staffInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="职务">
          <el-select v-model="staffInfo.type">
            <el-option label="激活" :value="true"></el-option>
            <el-option label="失效" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="staffInfo.type">
            <el-option label="男" :value="0"></el-option>
            <el-option label="女" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份证号码">
          <el-input v-model="staffInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" class="departmentItem">
          <el-input v-model="staffInfo.department" suffix-icon="xxx" @focus="focusDepartment" @blur="blurDepartment" ref="treeInput"></el-input>
          <el-tree :data="data" :props="defaultProps" @node-click="selectDepartment" class="tree" :class="{treeVisible}"
                   @node-expand="treeNode" @node-collapse="treeNode"></el-tree>
        </el-form-item>
        <el-form-item label="职级">
          <el-input v-model="staffInfo.name" suffix-icon="xxx"></el-input>
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
export default {
  name: 'Staff',
  components: {Table,DeleteRow},
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
        children: 'children',
        label: 'label'
      },
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
      staffInfo: {},
      treeVisible:false,
      isFocus:false,
    }
  },
  methods: {
    onSubmit() {console.log(this.formInline)},
    selectRow(val) {
      this.selectedRow = []
      val.forEach(item => {
        this.selectedRow.push(item)
      })
      console.log(this.selectedRow)
    },
//表格增删改查
    add() {
      this.staffInfo = {}
      this.editDialogDisabled = false
      this.editDialogVisible = true
    },
    update() {
      this.editDialogDisabled = false
      if (this.selectedRow.length === 1) {
        this.staffInfo = this.selectedRow[0]
        this.editDialogVisible = true
      } else {
        this.$message.error('请选择一行数据')
      }
    },
    confirmEdit(){
      this.editDialogVisible = false
    },
    view(row){
      this.staffInfo = row
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
      console.log(data);
      this.treeVisible = false
      this.staffInfo.department = data.label
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
      }
      .treeVisible{
        display: block;
      }
    }

  }

}
</style>