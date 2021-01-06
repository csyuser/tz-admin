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
    <el-dialog :title="dialogTitle" :visible.sync="editDialogVisible" width="1000px" :before-close="handleClose">
      <el-form label-position="right" label-width="95px" :inline="true" :model="editFormInfo" size="small" class="addForm"
               :disabled="editDialogDisabled" :rules="rules" ref="editDialog">
        <el-form-item label="人员名称" prop="name">
          <el-input v-model="editFormInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="人员编码" prop="code">
          <el-input v-model="editFormInfo.code" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="职务" prop="post">
          <el-select v-model="editFormInfo.post">
            <el-option :label="item['dropName']" :value="item['id']" v-for="item in postDrop" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职级" prop="rank">
          <el-select v-model="editFormInfo['rank']">
            <el-option :label="item['dropName']" :value="item['id']" v-for="item in rankDrop" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="editFormInfo['sex']">
            <el-option label="女" :value="0"></el-option>
            <el-option label="男" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门" prop="departmentId" style="height: 32px">
          <SelectTree v-model="editFormInfo.departmentId" :options="treeData" :props="defaultProps" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="editFormInfo.phone" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="联系邮箱" prop="email">
          <el-input v-model="editFormInfo.email" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码" prop="idCard">
          <el-input v-model="editFormInfo['idCard']" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="entryTime">
          <el-date-picker v-model="editFormInfo['entryTime']" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 215px"></el-date-picker>
        </el-form-item>
        <el-form-item label="离职时间">
          <el-date-picker v-model="editFormInfo['departureTime']" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 215px"></el-date-picker>
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
import SelectTree from '@/components/permission/SelectTree'
import {mixins} from '@/mixins/mixins'

export default {
  name: 'Staff',
  components: {Table,DeleteRow,SelectTree},
  mixins:[mixins],
  data() {
    return {
      colsHead: [{prop: 'name', label: '人员名称'}, {prop: 'code', label: '员工编码'}, {prop: 'postName', label: '职务'},
        {prop: 'rankName', label: '职级'}, {prop: 'sex', label: '性别'},{prop: 'departmentName', label: '部门名称'},{prop: 'phone', label: '电话'},
        {prop: 'email', label: '电子邮箱'}, {prop: 'idCard', label: '身份证号'}, {prop: 'entryTime', label: '入职时间'},{prop: 'departureTime', label: '离职时间'}],
    }
  },
  mounted() {
    this.getPages('/person/page')
    this.getDepartmentTree('/department/selectDepartmentTree')
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
  }

}
</style>