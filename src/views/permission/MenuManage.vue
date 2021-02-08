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
    <el-dialog :title="dialogTitle" :visible.sync="editDialogVisible" width="650px" :before-close="handleClose"
               @closed="closedDialog">
      <el-form label-position="right" label-width="80px" ref="editDialog" :inline="true" :model="editFormInfo"
               size="small"
               class="addForm" :disabled="editDialogDisabled" :rules="rules">
        <el-form-item label="功能类型" prop="menuType">
          <!--          <el-input v-model="editFormInfo.type" suffix-icon="xxx"></el-input>-->
          <el-radio-group v-model="editFormInfo['menuType']">
            <el-radio label="0">一级菜单</el-radio>
            <el-radio label="1">页面菜单</el-radio>
            <el-radio label="2">页面功能</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="editFormInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="英文字段" prop="buttonId" v-if="editFormInfo['menuType'] && editFormInfo['menuType'] === '2'">
          <el-input v-model="editFormInfo['buttonId']" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort" :rules="{ required: true, type: 'number', message: '排序必须为数字值'}"
                      v-if="editFormInfo['menuType'] && editFormInfo['menuType'] !== '2'">
          <el-input v-model.number="editFormInfo.sort" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" class="departmentItem" prop="parentId"
                      v-if="editFormInfo['menuType'] && editFormInfo['menuType'] !== '0'">
          <el-select v-model="editFormInfo.parentId" v-if="editFormInfo['menuType'] === '1'">
            <el-option :label="parentMenu.name" :value="parentMenu.id" v-for="parentMenu in parentMenus"
                       :key="parentMenu.id"></el-option>
          </el-select>
          <SelectTree v-model="editFormInfo.parentId" :options="parentMenus" :props="defaultProps"
                      :disabled="editDialogDisabled" v-if="editFormInfo['menuType'] === '2'"></SelectTree>
        </el-form-item>
        <el-form-item label="菜单地址" v-if="editFormInfo['menuType'] && editFormInfo['menuType'] === '1'">
          <el-input v-model="editFormInfo.url" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="图标名称" v-if="editFormInfo['menuType'] && editFormInfo['menuType'] !== '1'">
          <el-input v-model="editFormInfo.icon" suffix-icon="xxx"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="small" v-if="dialogType!=='view'">取 消</el-button>
        <el-button type="primary" @click="confirmEdit"
                   size="small">{{ dialogType !== 'view' ? '确 定' : '关 闭' }}</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除菜单" :visible.sync="deleteDialogVisible" width="650px" :before-close="handleClose">
      <DeleteRow @cancel="deleteDialogVisible = false" @confirm="confirmDelete"></DeleteRow>
    </el-dialog>
  </div>
</template>

<script>
import Table from '@/components/Table'
import DeleteRow from '@/components/permission/DeleteRow'
import SelectTree from '@/components/permission/SelectTree'
import {mixins} from '@/mixins/mixins'

export default {
  name: 'MenuManage',
  components: {Table, DeleteRow, SelectTree},
  mixins: [mixins],
  data() {
    return {
      colsHead: [{prop: 'name', label: '名称'}, {prop: 'menuType', label: '功能类型'}, {prop: 'sort', label: '排序'},
        {prop: 'parentName', label: '上级菜单'}, {prop: 'url', label: '菜单地址'},],
      rules: {
        parentId: [{required: true, message: '上级菜单不能为空', trigger: 'change'}],
        buttonId: [{required: true, message: '英文字段不能为空', trigger: 'blur'}],
        menuType:[{required: true, message: '菜单类型不能为空', trigger: 'change'}]
      },
      parentMenus: [],
    }
  },
  mounted() {
    this.getPages('/menu/page')
  },
  watch:{
    editFormInfo: {
      handler(newVal) {
        this.menuTypeChange(newVal.menuType)
      },
      deep: true
    }
  },
  methods: {
    menuTypeChange(menuType) {
      switch (menuType) {
        case '1':
          this.getMenu('/dropList/selectMenu')
          break
        case '2':
          this.getMenu('/menu/selectAllMenuTree')
          break
        default:
          break
      }
    },
    getMenu(url) {
      this.axios.get(url)
          .then(res => {
            if (res.data.code.toString() === '200') {
              this.parentMenus = res.data.data
              if (this.editFormInfo.menuType === '2'){
                let parentId = this.editFormInfo.parentId
                this.$set(this.editFormInfo,'parentId',parentId)
              }
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
      this.$set(this.editFormInfo,'menuType','0')
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