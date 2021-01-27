<template>
  <div class="post-manage-wrap">
    <el-form :inline="true" :model="searchData" class="demo-form-inline searchForm">
      <el-form-item>
        <el-input v-model="searchData.name" placeholder="输入名称" size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" size="small">查询</el-button>
      </el-form-item>
    </el-form>
    <Table :colsHead="colsHead" :tableDatas="tableDatas" :pageSize="pageSize" :page="page"
           @add="add" @update="update" @postSelect="selectPostRow"
           @currentChange="currentChange" @delete="deleteRows" @dblclick="view">
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
      <el-form label-position="right" label-width="80px" :inline="true" :model="editFormInfo" size="small" class="addForm"
               :disabled="editDialogDisabled" :rules="rules" ref="editDialog">
        <el-form-item label="岗位名称" prop="name">
          <el-input v-model="editFormInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="岗位编码" prop="code">
          <el-input v-model="editFormInfo.code" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="部门名称" prop="departmentId" style="height: 32px">
          <SelectTree v-model="editFormInfo.departmentId" :options="treeData" :props="defaultProps" :disabled="editDialogDisabled"/>
        </el-form-item>
        <el-form-item label="岗位类型" prop="roleType">
          <el-select v-model="editFormInfo['roleType']">
            <el-option label="管理岗位" value="0"></el-option>
            <el-option label="普通岗位" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="岗位描述" class="texArea">
          <el-input v-model="editFormInfo.describe" type="textarea" :autosize="{ minRows: 3, maxRows: 3}"></el-input>
        </el-form-item>
      </el-form>
      <PostDialog :type="dialogType" title-type="岗位" @update:relate="relatedPermission" v-if="dialogType !== 'add'"></PostDialog>
      <PostDialog :type="dialogType" title-type="角色" @update:relate="relatedPermission" v-if="dialogType !== 'add'"></PostDialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="confirmEdit" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除岗位" :visible.sync="deleteDialogVisible" width="650px" :before-close="handleClose">
      <DeleteRow @cancel="deleteDialogVisible = false" @confirm="confirmDelete"></DeleteRow>
    </el-dialog>
    <el-dialog :title="relatedTitle" :visible.sync="relatedDialogVisible" width="700px" append-to-body>
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
import SelectTree from '@/components/permission/SelectTree'
import PostDialog from'@/components/permission/dialog/PostDialog'
import {mixins} from '@/mixins/mixins'
import {relateMixins} from '@/mixins/relateMixins'

export default {
  name: 'PostManage',
  components: {Table, DeleteRow, SvgIcon,SelectTree,PostDialog},
  mixins:[mixins,relateMixins],
  data() {
    return {
      selectedRow: [],
      colsHead: [{prop: 'name', label: '岗位名称'}, {prop: 'code', label: '岗位编码'}, {
        prop: 'departmentName', label: '部门名称'}, {prop: 'roleType', label: '岗位类型'}, {prop: 'describe', label: '角色描述'}],
    }
  },
  mounted() {
    this.getPages('/role/page')
    this.getDepartmentTree('/department/selectDepartmentTree')
    this.$store.commit('setBreadcrumb',[''])
  },
  methods: {
    currentChange(val, row) {
      this.currentPageChange(val, row, '/role/page')
    },

//表格增删改查
    selectPostRow(val) {
      this.selectedRows(val)
    },
    search() {
      this.searchRow('/role/page')
    },
    add() {
      this.dialogTitle = '新增岗位'
      this.addRow()
    },
    update() {
      this.dialogTitle = '编辑岗位'
      this.updateRow()
    },
    confirmEdit() {
      this.confirmEditRow('/role/save', '/role/page')
    },
    view(row) {
      this.dialogTitle = '查看岗位信息'
      this.viewRow(row)
    },
    deleteRows() {
      this.deleteRow()
    },
    confirmDelete() {
      this.confirmDeleteRow('/role/delete', '/role/page')
    },
//关联权限，范围
    relatedPermission() {
      this.relatedName = 'permission'
      this.related('/role/selectRoleAndPermission','关联权限',{roleId:this.selectedRow[0] && this.selectedRow[0].id})
    },
    relatedUser() {
      this.relatedName = 'user'
      this.related('/role/selectRoleAndUser','关联用户',{roleId:this.selectedRow[0] && this.selectedRow[0].id})
    },
    confirmTransform() {
      if (this.relatedName === 'permission'){this.confirmRelate('/permission-relation/saveTeamAndPermission', {
        type: '0',
        relationIds: [this.selectedRow[0].id],
        permissionIds: this.relatedValue,
        relationType:'1'
      })}
      else if (this.relatedName === 'user'){this.confirmRelate('/role/saveUserRole',{
        type:'1',
        roleIds:[this.selectedRow[0].id],
        userIds:this.relatedValue
      })}
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
    //border-bottom: 1px solid #dcdfe6;
    > .el-form-item {
      margin-bottom: 18px;
    }
    > .texArea{
      display: block;
      &::v-deep{
        margin-bottom: 0;
        .el-form-item__content{
          width: calc(100% - 80px);
        }
      }
    }
  }
}

</style>