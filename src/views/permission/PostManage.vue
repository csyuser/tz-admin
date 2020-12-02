<template>
  <div class="post-manage-wrap">
    <el-form :inline="true" :model="formInline" class="demo-form-inline searchForm">
      <el-form-item>
        <el-input v-model="formInline.name" placeholder="输入名称" size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" size="small">查询</el-button>
      </el-form-item>
    </el-form>
    <Table :colsHead="colsHead" :tableDatas="tableDatas" :pageSize="pageSize" :page="page"
           @add="add" @update="update" @postSelect="selectPostRow"
           @currentChange="currentChange" @delete="deleteRow" @dblclick="viewPost">
      <el-button size="small" class="update" @click="relatedPermission">
        <SvgIcon icon-name="permission"></SvgIcon>
        关联权限
      </el-button>
      <el-button size="small" class="update" @click="relatedUser">
        <SvgIcon icon-name="user"></SvgIcon>
        关联用户
      </el-button>
    </Table>
    <el-dialog :title="dialogTitle" :visible.sync="editDialogVisible" width="650px" :before-close="handleClose">
      <el-form label-position="right" label-width="80px" :inline="true" :model="postInfo" size="small" class="addForm"
               :disabled="editDialogDisabled">
        <el-form-item label="岗位名称">
          <el-input v-model="postInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="岗位编码">
          <el-input v-model="postInfo.code" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="部门名称" class="departmentItem">
          <el-input readonly v-model="postInfo.departmentName" :suffix-icon="iconName" @focus="focus" @blur="blur" placeholder="请选择"
                    ref="treeInput"></el-input>
          <el-tree :data="data" :props="defaultProps" @node-click="select" class="tree" :class="{treeVisible}"
                   @node-expand="treeNode" @node-collapse="treeNode"></el-tree>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="postInfo.describe" suffix-icon="xxx"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="confirmEdit" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除岗位" :visible.sync="deleteDialogVisible" width="650px" :before-close="handleClose">
      <DeleteRow @cancel="deleteDialogVisible = false" @confirm="confirmDelete"></DeleteRow>
    </el-dialog>
    <el-dialog :title="relatedTitle" :visible.sync="relatedDialogVisible" width="700px">
      <el-transfer
          filterable
          :filter-method="filterMethod"
          filter-placeholder="请输入"
          v-model="relatedValue"
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
import {mixins} from '@/mixins/mixins'

export default {
  name: 'PostManage',
  components: {Table, DeleteRow, SvgIcon},
  mixins:[mixins],
  data() {
    return {
      selectedRow: [],
      colsHead: [{prop: 'name', label: '岗位名称'}, {prop: 'code', label: '岗位编码'}, {
        prop: 'departmentName', label: '部门名称'}, {prop: 'describe', label: '角色描述'}],
      tableDatas: {},
      formInline: {
        name: '',
      },
      page: 1,
      pageSize: 5,
      dialogType: '',
      dialogTitle: '',
      editDialogVisible: false,
      deleteDialogVisible: false,
      editDialogDisabled: false,
      deleteIds: [],
      postInfo: {
        name: '',
        order: '',
        coding: '',
        type: false
      },
      relatedDialogVisible: false,
      relatedName: '',
      data: [],
      defaultProps: {
        children: 'child',
        label: 'name'
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
  },
  methods: {
    getPages(formInline) {
      this.axios.get(this.prefixAddr + '/role/page', {
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
    selectPostRow(val) {
      this.selectedRow = []
      val.forEach(item => {
        this.selectedRow.push(item)
      })
      console.log(this.selectedRow)
    },
    search() {
      this.getPages(this.formInline)
    },
    add() {
      this.dialogType = 'add'
      this.dialogTitle = '增加岗位'
      this.postInfo = {}
      this.editDialogDisabled = false
      this.editDialogVisible = true
    },
    update() {
      this.dialogType = 'update'
      this.dialogTitle = '编辑岗位'
      this.editDialogDisabled = false
      if (this.selectedRow.length === 1) {
        this.postInfo = this.selectedRow[0]
        this.editDialogVisible = true
      } else {
        this.$message.error('请选择一行数据')
      }
    },
    confirmEdit() {
      this.editDialogVisible = false
      let editData = {}
      if (this.dialogType === 'add') {
        editData = this.postInfo
      } else if (this.dialogType === 'update') {editData = {id: this.selectedRow.id, ...this.postInfo}}
      if (this.dialogType !== 'view'){
        this.axios.post(this.prefixAddr + '/role/save', {...editData})
            .then(res => {
              if (res.data.code.toString() === '200') {
                this.$message.success('保存成功')
                this.getPages()
              } else this.$message.error(res.data.msg)
            })
            .catch()
      }
    },
    viewPost(row) {
      this.dialogType = 'view'
      this.dialogTitle = '查看岗位'
      this.postInfo = row
      this.editDialogVisible = true
      this.editDialogDisabled = true
    },
    deleteRow() {
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
      this.axios.post(this.prefixAddr + '/role/delete', {ids: this.deleteIds})
          .then(res => {
            if (res.data.code.toString() === '200') {
              this.$message.success('删除成功')
              this.getPages(this.page, this.pageSize)
            } else {this.$message.error(this.data.msg)}
            console.log(res)
          })
          .catch(error => {this.$message.error('删除失败' + error)})
    },
//关联权限，范围
    relatedPermission() {
      this.relatedName = 'permission'
      this.related('','关联权限',{roleId:this.selectedRow[0] && this.selectedRow[0].id})
    },
    relatedUser() {
      this.relatedName = 'user'
      this.related('/role/selectRoleAndUser','关联用户',{roleId:this.selectedRow[0] && this.selectedRow[0].id})
    },
    confirmTransform() {
      if (this.relatedName === 'permission'){this.confirmRelate('', {
        type: '',
        userIds: [this.selectedRow[0].id],
        // roleIds: this.relatedValue
      })}
      else if (this.relatedName === 'user'){this.confirmRelate('/role/saveUserRole',{
        type:'1',
        roleIds:[this.selectedRow[0].id],
        userIds:this.relatedValue
      })}
    },
//输入框树形结构
    treeNode() {
      this.nodeClick()
    },
    focus() {
      this.focusInput()
    },
    blur() {
      this.blurInput()
    },
    select(data) {
      this.selectTree(data)
      this.postInfo.departmentName = data.name
      this.postInfo.departmentId = data.id
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
.post-manage-wrap {
  padding: 20px;

  > .searchForm {
    > .selectInput {
      width: 100px;
    }
  }

  .addForm {
    > .el-form-item {
      margin-bottom: 18px;

      &:nth-child(3) {
        margin-bottom: 0;
      }

      &:nth-child(4) {
        margin-bottom: 0;
      }
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
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      }

      .treeVisible {
        display: block;
      }
    }


  }
}

</style>