<template>
  <div class="department-wrap">
    <el-form :inline="true" :model="searchData" class="demo-form-inline searchForm">
      <el-form-item>
        <el-input v-model="searchData.name" placeholder="输入名称" size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <Table :colsHead="colsHead" :tableDatas="tableDatas" :pageSize="pageSize" :page="page" @add="add"
           @update="update"
           @postSelect="selectRow" @delete="deleteRows" @dblclick="view" @currentChange="currentChange">
    </Table>
    <el-dialog :title="dialogTitle" :visible.sync="editDialogVisible" width="970px" :before-close="handleClose">
      <el-form label-position="right" label-width="85px" :inline="true" :model="editFormInfo" size="small"
               class="addForm" :disabled="editDialogDisabled" :rules="rules" ref="editDialog">
        <el-form-item label="部门分类" prop="classId">
          <el-select v-model="editFormInfo.classId">
            <el-option :label="item['dropName']" :value="item['id']" v-for="item in departmentClassifyDrop" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门名称" prop="name" >
          <el-input v-model="editFormInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="部门编号" prop="code">
          <el-input v-model="editFormInfo.code" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="部门级别" prop="level2">
          <el-select v-model="editFormInfo['level2']">
            <el-option :label="item['dropName']" :value="item['id']" v-for="item in departmentLevelDrop" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上级部门"  style="height: 32px">
          <SelectTree v-model="editFormInfo.parentId" :options="treeData" :props="defaultProps" :disabled="editDialogDisabled"/>
        </el-form-item>
        <el-form-item label="行政区划">
          <el-input v-model="editFormInfo.regionName" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="选用标志" prop="selection">
          <el-select v-model="editFormInfo.selection">
            <el-option label="选用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" class="texArea">
          <el-input v-model="editFormInfo.describe" type="textarea" :autosize="{ minRows: 4, maxRows: 4}"></el-input>
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
  </div>
</template>

<script>
// import Qs from 'qs'
import Table from '@/components/permission/Table'
import DeleteRow from '@/components/permission/DeleteRow'
import SelectTree from '@/components/permission/SelectTree'
import {mixins} from '@/mixins/mixins'

export default {
  name: 'Department',
  components: {Table, DeleteRow,SelectTree},
  mixins:[mixins],
  data() {
    return {
      colsHead: [{prop: 'className', label: '部门分类'}, {prop: 'name', label: '部门名称'}, {prop: 'code', label: '部门编号'},
        {prop: 'level2Name', label: '部门级别'}, {prop: 'parentName', label: '上级部门'}, {prop: 'regionName', label: '行政区划'},
        {prop: 'selection', label: '选用标志'}, {prop: 'describe', label: '描述'}],
    }
  },
  mounted() {
    this.getPages('/department/page')
    this.getDepartmentTree('/department/selectDepartmentTree')
    this.getDropList('1')
    this.getDropList('2')
  },
  methods: {
    currentChange(val, row) {
      this.currentPageChange(val, row, '/department/page')
    },
//部门的增删改查
    search(){
      this.searchRow('/department/page')
    },
    selectRow(val) {
      this.selectedRows(val)
    },
    add() {
      this.dialogTitle = '新增部门'
      this.addRow()
    },
    update() {
      this.dialogTitle = '编辑部门'
      this.updateRow()
    },
    confirmEdit() {
      this.confirmEditRow('/department/save', '/department/page')
    },
    view(row) {
      this.dialogTitle = '查看部门信息'
      this.viewRow(row)
    },
    deleteRows() {
      this.deleteRow()
    },
    confirmDelete() {
      this.confirmDeleteRow('/department/delete', '/department/page')
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
    > .texArea{
      display: block;
      &::v-deep{
        margin-bottom: 0;
        .el-form-item__content{
          width: calc(100% - 85px);
        }
      }
    }
  }
}
</style>