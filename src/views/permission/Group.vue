<template>
  <div class="group-wrap">
    <el-form :inline="true" :model="formInline" class="demo-form-inline searchForm">
      <el-form-item>
        <el-input v-model="formInline.name" placeholder="输入名称或邮箱搜索" size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <Table :colsHead="colsHead" :tableDatas="tableDatas" :pageSize="pageSize" :page="page"
           @currentChange="currentChange" @add="add" @update="update" @postSelect="selectRow"
           @delete="deleteRows" @dblclick="view">
      <el-button size="small" class="update" @click="relatedUser">
        <SvgIcon icon-name="user"></SvgIcon>
        关联用户
      </el-button>
      <el-button size="small" class="update" @click="relatedPermission">
        <SvgIcon icon-name="permission"></SvgIcon>
        关联权限
      </el-button>
    </Table>
    <el-dialog :title="dialogTitle" :visible.sync="editDialogVisible" width="970px">
      <el-form label-position="right" label-width="85px" :inline="true" :model="groupInfo" size="small" ref="addForm"
               class="addForm"
               :disabled="editDialogDisabled">
        <el-form-item label="小组名称">
          <el-input v-model="groupInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="小组编号">
          <el-input v-model="groupInfo.code" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" class="departmentItem">
          <el-input readonly v-model="groupInfo.departmentName" suffix-icon="xxx" @focus="focus" @blur="blur"
                    ref="treeInput"></el-input>
          <el-tree :data="data" :props="defaultProps" @node-click="select" class="tree" :class="{treeVisible}"
                   @node-expand="treeNode" @node-collapse="treeNode"></el-tree>
        </el-form-item>
        <el-form-item label="小组描述">
          <el-input v-model="groupInfo.describe" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort" :rules="{ type: 'number', message: '排序必须为数字值'}">
          <el-input v-model.number="groupInfo.sort" suffix-icon="xxx"></el-input>
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
  name: 'Group',
  components: {Table, DeleteRow, SvgIcon},
  data() {
    return {
      formInline: {},
      colsHead: [{prop: 'name', label: '小组名称'}, {prop: 'code', label: '小组编号'}, {prop: 'departmentName', label: '所属部门'},
        {prop: 'describe', label: '小组描述'}, {prop: 'sort', label: '排序'}, {prop: 'valid', label: '是否有效'},],
      tableDatas: {},
      page: 1,
      pageSize: 10,
      dialogTitle: '',
      dialogType: '',
      deleteIds: [],
      editDialogVisible: false,
      editDialogDisabled: false,
      deleteDialogVisible: false,
      selectedRow: [],
      groupInfo: {},
      transformData: [],
      value: [],
      filterMethod(query, item) {
        return item.label.indexOf(query) > -1
      },
      relatedTitle: '',
      relatedDialogVisible: false,
      userVal: [],
      permissionVal: [],
      transformType: '',
      data: [],
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      treeVisible: false,
      isFocus: false,
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
  },
  methods: {
    getPages(formInline) {
      this.axios.get(this.prefixAddr + '/team/page', {
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
    //表格增删改查
    selectRow(val) {
      this.selectedRow = []
      val.forEach(item => {
        this.selectedRow.push(item)
      })
    },
    search() {
      this.getPages(this.formInline)
    },
    add() {
      this.dialogType = 'add'
      this.dialogTitle = '新增小组'
      this.groupInfo = {}
      this.editDialogDisabled = false
      this.editDialogVisible = true
    },
    update() {
      this.dialogType = 'update'
      this.dialogTitle = '编辑小组'
      this.editDialogDisabled = false
      if (this.selectedRow.length === 1) {
        this.groupInfo = this.selectedRow[0]
        console.log(this.selectedRow[0].sort)
        this.groupInfo.sort = parseInt(this.selectedRow[0].sort)
        this.editDialogVisible = true
      } else {
        this.$message.error('请选择一行数据')
      }
    },
    confirmEdit() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.editDialogVisible = false
          let editData = {}
          if (this.dialogType === 'add') {
            editData = this.groupInfo
          } else if (this.dialogType === 'update') {editData = {id: this.selectedRow.id, ...this.groupInfo}}
          if (this.dialogType !== 'view') {
            this.axios.post(this.prefixAddr + '/team/save', {...editData})
                .then(res => {
                  if (res.data.code.toString() === '200') {
                    this.$message.success('保存成功')
                    this.getPages()
                  } else this.$message.error(res.data.msg)
                })
                .catch()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })

    },
    view(row) {
      this.dialogType = 'view'
      this.dialogTitle = '查看小组信息'
      this.groupInfo = row
      this.editDialogVisible = true
      this.editDialogDisabled = true
    },
    deleteRows() {
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
      console.log('删除')
      console.log(this.selectedRow)
      console.log(this.deleteIds)
      this.axios.post(this.prefixAddr + '/team/delete', {ids: this.deleteIds})
          .then(res => {
            if (res.data.code.toString() === '200') {
              this.$message.success('删除成功')
              this.getPages()
            } else {this.$message.error(this.data.msg)}
          })
          .catch(error => {this.$message.error('删除失败' + error)})
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
    relatedPermission() {
      this.value = this.permissionVal
      this.transformType = 'permission'
      this.relatedTitle = '关联权限'
      this.relatedDialogVisible = true
      this.transformData = [{label: '前端', key: '前端',}, {label: '后端', key: '后端'}, {label: '测试', key: '测试'},
        {label: 'ui', key: 'ui'}]
    },
    confirmTransform() {
      this.relatedDialogVisible = false
      if (this.transformType === 'user') {
        this.userVal = this.value
      } else if (this.transformType === 'permission') {
        this.permissionVal = this.value
      }
      console.log(this.value)
    },
//输入框树形结构
    treeNode() {
      this.isFocus = true
      this.treeVisible = true
      this.$refs.treeInput.focus()
    },
    focus() {
      this.treeVisible = true
    },
    blur() {
      this.isFocus = false
      setTimeout(() => {
        if (this.isFocus !== true) {
          this.treeVisible = false
        }
      }, 100)
    },
    select(data) {
      this.treeVisible = false
      this.groupInfo.departmentName = data.name
      this.groupInfo.departmentId = data.id
    },
  }
}
</script>

<style scoped lang='scss'>
.group-wrap {
  padding: 20px;
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