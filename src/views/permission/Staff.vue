<template>
  <div class="staff-wrap">
    <el-form :inline="true" :model="searchData" class="demo-form-inline searchForm">
      <el-form-item>
        <el-input v-model="searchData.name" placeholder="输入名称" size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" size="small">查询</el-button>
      </el-form-item>
    </el-form>
    <Table :colsHead="colsHead" :tableDatas="tableDatas" :pageSize="pageSize" :page="page" @currentChange="currentChange"
           @add="add" @update="update" @postSelect="selectRow"
           @delete="deleteRows" @dblclick="view"></Table>
    <el-dialog :title="dialogTitle" :visible.sync="editDialogVisible" width="970px" :before-close="handleClose">
      <el-form label-position="right" label-width="85px" :inline="true" :model="editFormInfo" size="small" class="addForm"
               :disabled="editDialogDisabled">
        <el-form-item label="人员名称">
          <el-input v-model="editFormInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="人员编码">
          <el-input v-model="editFormInfo.code" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="职务">
          <el-select v-model="editFormInfo.post">
            <el-option :label="item['dropName']" :value="item['id']" v-for="item in postDrop" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职级">
          <el-select v-model="editFormInfo['rank']">
            <el-option :label="item['dropName']" :value="item['id']" v-for="item in rankDrop" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="editFormInfo['sex']">
            <el-option label="女" :value="0"></el-option>
            <el-option label="男" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门" class="departmentItem">
          <el-input v-model="editFormInfo.departmentName" readonly placeholder="请选择" :suffix-icon="iconName" @focus="focusDepartment" @blur="blurDepartment" ref="treeInput"></el-input>
          <el-tree :data="data" :props="defaultProps" @node-click="selectDepartment" class="tree" :class="{treeVisible}"
                   @node-expand="treeNode" @node-collapse="treeNode"></el-tree>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="editFormInfo.phone" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="联系邮箱">
          <el-input v-model="editFormInfo.email" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码">
          <el-input v-model="editFormInfo['idCard']" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="入职时间">
          <el-date-picker v-model="editFormInfo['entryTime']" type="date" placeholder="选择日期" style="width: 215px"></el-date-picker>
        </el-form-item>
        <el-form-item label="离职时间">
          <el-date-picker v-model="editFormInfo['departureTime']" type="date" placeholder="选择日期" style="width: 215px"></el-date-picker>
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
import {mixins} from '@/mixins/mixins'

export default {
  name: 'Staff',
  components: {Table,DeleteRow},
  mixins:[mixins],
  data() {
    return {
      data: [],
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      colsHead: [{prop: 'name', label: '人员名称'}, {prop: 'code', label: '员工编码'}, {prop: 'postName', label: '职务'},
        {prop: 'rankName', label: '职级'}, {prop: 'sex', label: '性别'},{prop: 'departmentName', label: '部门名称'},{prop: 'phone', label: '电话'},
        {prop: 'email', label: '电子邮箱'}, {prop: 'idCard', label: '身份证号'}, {prop: 'entryTime', label: '入职时间'},{prop: 'departureTime', label: '离职时间'}],
    }
  },
  mounted() {
    this.getPages('/person/page')
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
    currentChange(val,row){
      this.currentPageChange(val, row, '/person/page')
    },
//表格增删改查
    selectRow(val) {
      this.selectedRows(val)
    },
    search() {
      this.searchRow('/person/page')
    },
    add() {
      this.dialogTitle = '新增人员'
      this.addRow()
    },
    update() {
      this.dialogTitle = '编辑人员'
      this.updateRow()
    },
    confirmEdit(){
      this.confirmEditRow('/person/save', '/person/page')
    },
    view(row){
      this.dialogTitle = '查看权限信息'
      this.viewRow(row)
    },
    deleteRows() {
      this.deleteRow()
    },
    confirmDelete(){
      this.confirmDeleteRow('/person/delete', '/person/page')
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
      this.editFormInfo.departmentName = data.name
      this.editFormInfo.departmentId = data.id
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
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      }
      .treeVisible{
        display: block;
      }
    }

  }

}
</style>