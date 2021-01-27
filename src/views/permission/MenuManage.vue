<template>
  <div class="menu-manege-wrap">
    <el-form :inline="true" :model="searchData" class="demo-form-inline searchForm">
      <el-form-item>
        <el-input v-model="searchData.name" placeholder="菜单名称" size="small"></el-input>
      </el-form-item>
      <el-form-item class="selectInput">
        <el-select v-model="searchData['parentId']" placeholder="上级菜单" clearable size="small">
          <el-option :label="parentMenu.name" :value="parentMenu.id" v-for="parentMenu in parentMenus"
                     :key="parentMenu.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" size="small">查询</el-button>
      </el-form-item>
    </el-form>
    <Table :colsHead="colsHead" :tableDatas="tableDatas" tableName="menu" @add="add" @update="update"
           @postSelect="selectRow"
           @currentChange="currentChange" @delete="deleteRows" @dblclick="viewPost"></Table>
    <el-dialog :title="dialogTitle" :visible.sync="editDialogVisible" width="650px" :before-close="handleClose" @closed="closedDialog">
      <el-form label-position="right" label-width="80px" ref="editDialog" :inline="true" :model="editFormInfo" size="small"
               class="addForm" :disabled="editDialogDisabled" :rules="rules">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="editFormInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort" :rules="{ required: true, type: 'number', message: '排序必须为数字值'}">
          <el-input v-model.number="editFormInfo.sort" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" class="departmentItem">
          <el-select v-model="editFormInfo.parentId">
            <el-option :label="parentMenu.name" :value="parentMenu.id" v-for="parentMenu in parentMenus"
                       :key="parentMenu.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单地址">
          <el-input v-model="editFormInfo.url" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="图标名称">
          <el-input v-model="editFormInfo.icon" suffix-icon="xxx"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="confirmEdit" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除菜单" :visible.sync="deleteDialogVisible" width="650px" :before-close="handleClose">
      <DeleteRow @cancel="deleteDialogVisible = false" @confirm="confirmDelete"></DeleteRow>
    </el-dialog>
  </div>
</template>

<script>
import Table from '@/components/permission/Table'
import DeleteRow from '@/components/permission/DeleteRow'
import {mixins} from '@/mixins/mixins'

export default {
  name: 'MenuManage',
  components: {Table, DeleteRow},
  mixins: [mixins],
  data() {
    return {
      colsHead: [{prop: 'name', label: '菜单名称'}, {prop: 'sort', label: '排序'},
        {prop: 'parentName', label: '上级菜单'}, {prop: 'url', label: '菜单地址'},],
      parentMenus: [],
    }
  },
  mounted() {
    this.getPages('/menu/page')
    this.getMenu()
  },
  methods: {
    getMenu() {
      this.axios.get('/dropList/selectMenu')
          .then(res => {
            if (res.data.code.toString() === '200') {
              this.parentMenus = res.data.data
            } else {this.parentMenus = []}
          })
          .catch()
    },
    currentChange(val, row) {
      this.currentPageChange(val, row, '/menu/page')
    },
//表格增删改查
    selectRow(val) {
      this.selectedRows(val)
    },
    search() {
      this.searchRow('/menu/page')
    },
    add() {
      this.dialogTitle = '新增菜单'
      this.addRow()
    },
    update() {
      this.dialogTitle = '编辑菜单'
      this.updateRow()
    },
    confirmEdit() {
      this.confirmEditRow('/menu/save', '/menu/page')
    },
    viewPost(row) {
      this.dialogTitle = '查看菜单信息'
      this.viewRow(row)
    },
    deleteRows() {
      this.deleteRow()
    },
    confirmDelete() {
      this.confirmDeleteRow('/menu/delete', '/menu/page')
    },
  }
}
</script>

<style scoped lang='scss'>
.menu-manege-wrap {
  padding: 20px;

  > .searchForm {
    > .selectInput {
      width: 150px;
    }
  }
}

</style>