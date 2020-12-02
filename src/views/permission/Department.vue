<template>
  <div class="department-wrap">
    <el-form :inline="true" :model="formInline" class="demo-form-inline searchForm">
      <el-form-item>
        <el-input v-model="formInline.name" placeholder="输入名称" size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <Table :colsHead="colsHead" :tableDatas="tableDatas" :pageSize="pageSize" :page="page" @add="addDepartment"
           @update="updateDepartment"
           @postSelect="selectRow" @delete="deleteDepartment" @dblclick="viewDepartment" @currentChange="currentChange">
<!--      <el-button size="small" class="update" @click="relatedUser">-->
<!--        <SvgIcon icon-name="user"></SvgIcon>-->
<!--        关联用户-->
<!--      </el-button>-->
    </Table>
    <el-dialog :title="dialogTitle" :visible.sync="editDialogVisible" width="970px" :before-close="handleClose">
      <el-form label-position="right" label-width="85px" :inline="true" :model="departmentInfo" size="small"
               class="addForm"
               :disabled="editDialogDisabled">
        <el-form-item label="部门分类">
          <el-select v-model="departmentInfo.classId">
            <el-option :label="item['dropName']" :value="item['id']" v-for="item in departmentClassifyDrop" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门名称">
          <el-input v-model="departmentInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="部门编号">
          <el-input v-model="departmentInfo.code" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="部门级别">
          <el-select v-model="departmentInfo['level2']">
            <el-option :label="item['dropName']" :value="item['id']" v-for="item in departmentLevelDrop" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上级部门" class="departmentItem">
          <el-input v-model="departmentInfo.parentName" readonly :suffix-icon="iconName" @focus="focusDepartment"
                    @blur="blurDepartment" ref="treeInput"></el-input>
          <el-tree :data="data" :props="defaultProps" @node-click="selectDepartment" class="tree" :class="{treeVisible}"
                   @node-expand="treeNode" @node-collapse="treeNode"></el-tree>
        </el-form-item>
        <el-form-item label="行政区划">
          <el-input v-model="departmentInfo.regionName" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="选用标志">
          <el-select v-model="departmentInfo.selection">
            <el-option label="选用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
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
  </div>
</template>

<script>
// import Qs from 'qs'
import Table from '@/components/permission/Table'
import DeleteRow from '@/components/permission/DeleteRow'
import {mixins} from '@/mixins/mixins'

export default {
  name: 'Department',
  components: {Table, DeleteRow},
  mixins:[mixins],
  data() {
    return {
      data: [],
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      formInline: {
        name: '',
      },
      colsHead: [{prop: 'className', label: '部门分类'}, {prop: 'name', label: '部门名称'}, {prop: 'code', label: '部门编号'},
        {prop: 'level2Name', label: '部门级别'}, {prop: 'parentName', label: '上级部门'}, {prop: 'regionName', label: '行政区划'},
        {prop: 'selection', label: '选用标志'}, {prop: 'describe', label: '描述'}],
      tableDatas: {},
      page: 1,
      pageSize: 10,
      dialogTitle: '',
      dialogType: '',
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
    this.getDropList('1')
    this.getDropList('2')
  },
  methods: {
    getPages(formInline) {
      this.axios.get(this.prefixAddr + '/department/page', {
        params: {
          page: this.page,
          pageSize: this.pageSize,
          ...formInline
        },
      }).then(res => {
        if (res.data.code.toString() === '200') {
          this.tableDatas = res.data
          this.selectedRow = []
        } else {
          this.$message.error(res.data.msg)
        }
      })
          .catch()
    },
    currentChange(val, row) {
      this.page = val
      this.selectedRow = row
      this.deleteIds = []
      this.getPages()
    },
//部门的增删改查
    search(){
      this.getPages(this.formInline)
    },
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
      if (this.dialogType === 'add') {
        editData = this.departmentInfo
      } else if (this.dialogType === 'update') {editData = {id: this.selectedRow.id, ...this.departmentInfo}}
      if (this.dialogType !== 'view'){
        this.axios.post(this.prefixAddr + '/department/save', {...editData})
            .then(res => {
              if (res.data.code.toString() === '200') {
                this.$message.success('保存成功')
                this.getPages()
              } else this.$message.error(res.data.msg)
            })
            .catch()
      }
    },
    viewDepartment(row) {
      this.dialogType = 'view'
      this.dialogTitle = '查看部门信息'
      this.departmentInfo = row
      this.editDialogVisible = true
      this.editDialogDisabled = true
    },
    deleteDepartment() {
      this.deleteIds = []
      if (this.selectedRow.length > 0) {
        this.deleteDialogVisible = true
        this.selectedRow.forEach(row => {
          this.deleteIds.push(row.id)
        })
      } else {
        this.$message.error('请选择至少一行数据')
      }
    },
    confirmDelete() {
      this.deleteDialogVisible = false
      this.axios.post(this.prefixAddr + '/department/delete', {ids: this.deleteIds})
          .then(res => {
            if (res.data.code.toString() === '200') {
              this.$message.success('删除成功')
              this.getPages()
            } else {this.$message.error(this.data.msg)}
          })
          .catch(error => {this.$message.error('删除失败' + error)})
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(() => {
            done()
          })
          .catch(() => {})
    },
//部门的数据下拉框
    treeNode() {
      this.nodeClick()
    },
    focusDepartment() {
      this.focusInput()
    },
    blurDepartment() {
      this.blurInput()
    },
    selectDepartment(data) {
      this.selectTree(data)
      this.departmentInfo.parentName = data.name
      this.departmentInfo.parentId = data.id
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

    .departmentItem {
      position: relative;

      .tree {
        display: none;
        position: absolute;
        border: 1px solid #DCDFE6;
        padding-right: 10px;
        width: 215px;
        border-radius: 4px;
        margin-top: 5px;
        z-index: 999;
      }

      .treeVisible {
        display: block;
      }
    }


  }
}
</style>