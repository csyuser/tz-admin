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
           @add="add" @update="update" @postSelect="selectPostRow" :button-list="buttonList"
           @currentChange="currentChange" @delete="deleteRows" @dblclick="view">
    </Table>
    <el-dialog :title="dialogTitle" :visible.sync="editDialogVisible" width="972px" top="10vh"
               :before-close="handleClose" @closed="closedDialog" class="editDialog">
      <el-form label-position="right" label-width="80px" :inline="true" :model="editFormInfo" size="small"
               class="addForm"
               :disabled="editDialogDisabled" :rules="rules" ref="editDialog">
        <el-form-item label="岗位名称" prop="name">
          <el-input v-model="editFormInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="岗位编码" prop="code">
          <el-input v-model="editFormInfo.code" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="部门名称" prop="departmentId" style="height: 32px" class="SelectTree-item">
          <SelectTree v-model="editFormInfo.departmentId" :options="treeData" :props="defaultProps"
                      :disabled="editDialogDisabled"/>
        </el-form-item>
        <el-form-item label="岗位类型" prop="roleType">
          <el-radio-group v-model="editFormInfo['roleType']">
            <el-radio label="0">管理岗位</el-radio>
            <el-radio label="1">普通岗位</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="岗位描述" class="texArea">
          <el-input v-model="editFormInfo.describe" type="textarea" :autosize="{ minRows: 3, maxRows: 3}"></el-input>
        </el-form-item>
      </el-form>
      <IconListDialog :type="dialogType" title-type="角色" :needBtn="showDialogBtn('relateRole')" @update:relate="relatedUser"
                      :iconDataList="editFormInfo['userList']"></IconListDialog>
      <AuthorityListDialog :table-datas1="editFormInfo.permissionList" :user-id="checkedId" :need-btn="showDialogBtn('relatePermission')" ButtonTitle="关联岗位"
                           :type="dialogType" @update:relatePermission="relatedPermission"></AuthorityListDialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="small" v-if="dialogType!=='view'">取消</el-button>
        <el-button type="primary" @click="confirmEdit" size="small" >{{dialogType!=='view'?'确 定':'关 闭'}}</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除岗位" :visible.sync="deleteDialogVisible" width="650px" :before-close="handleClose">
      <DeleteRow @cancel="deleteDialogVisible = false" @confirm="confirmDelete"></DeleteRow>
    </el-dialog>
    <el-dialog :title="relatedTitle" :visible.sync="relatedDialogVisible" width="700px" append-to-body @closed="closedTransfer"
               :before-close="handleClose" class="relatedDialog">
      <el-transfer filterable :filter-method="filterMethod" filter-placeholder="请输入" v-model="relatedValue"
                   :data="transformData" v-if="relatedName === 'user'">
      </el-transfer>
      <TreeTransfer ref="transfer" v-if="relatedName === 'permission'" :url="relateUrl" :params="params" @update:relate="updateRelate"></TreeTransfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="relatedDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="confirmTransform">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Table from '@/components/Table'
import DeleteRow from '@/components/permission/DeleteRow'
import SelectTree from '@/components/permission/SelectTree'
import IconListDialog from '@/components/permission/dialog/IconListDialog'
import AuthorityListDialog from '@/components/permission/dialog/AuthorityListDialog'
import TreeTransfer from '@/components/TreeTransfer'
import {mixins} from '@/mixins/mixins'

export default {
  name: 'PostManage',
  components: {Table, DeleteRow, SelectTree, IconListDialog, AuthorityListDialog, TreeTransfer},
  mixins: [mixins],
  data() {
    return {
      selectedRow: [],
      colsHead: [{prop: 'name', label: '岗位名称'}, {prop: 'code', label: '岗位编码'}, {
        prop: 'departmentName', label: '部门名称'
      }, {prop: 'roleType', label: '岗位类型'}, {prop: 'describe', label: '角色描述'}],
      relateUrl: '',
      params: {},
      teamIds:[],
      permissionIds:[],
      permissionIds1:[]
    }
  },
  mounted() {
    this.getPages('/role/page')
    this.getDepartmentTree('/department/selectDepartmentTree')
    this.$store.commit('setBreadcrumb', [''])
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
      this.updateRow2('roleId', '/role/selectRoleInfo')
    },
    confirmEdit() {
      this.confirmEditRow('/role/save', '/role/page')
    },
    view(row) {
      this.dialogTitle = '查看岗位信息'
      this.viewRow2(row, 'roleId', '/role/selectRoleInfo')
    },
    deleteRows() {
      this.deleteRow()
    },
    confirmDelete() {
      this.confirmDeleteRow('/role/delete', '/role/page')
    },
//关联权限，范围
    updateRelate(val){
      let arr = []
      let teamIds = []
      let arr2 = []
      val.forEach(item=>{
        if (item.children && item.children.length>=1){
          teamIds.push(item.id)
          item.children.forEach(child=>{
            arr2.push(child.sign)
          })
        }else {
          arr.push(item.id)
          arr2.push(item.id)
        }
      })
      this.permissionIds = arr
      this.teamIds = teamIds
      this.permissionIds1 = arr2
    },
    relatedPermission() {
      this.relatedName = 'permission'
      this.relatedDialogVisible = true
      this.relatedTitle = '关联权限'
      this.relateUrl = '/role/selectRoleAndPermission'
      let id = this.dialogType==='add'?'':this.selectedRow[0] && this.selectedRow[0].id
      this.params = {roleId: id}
    },
    relatedUser() {
      this.relatedName = 'user'
      let id = this.dialogType==='add'?'':this.selectedRow[0] && this.selectedRow[0].id
      this.related('/role/selectRoleAndUser', '关联用户', {roleId: id})
    },
    confirmTransform() {
      this.relatedDialogVisible = false
      if (this.relatedName === 'permission') {
        this.axios.get('/permission/selectPermissionByIds',{params:{permissionIds:this.permissionIds1.join(',')}})
            .then(res=>{
              if (res.data.code.toString() === '200'){
                this.$set(this.editFormInfo,'permissionList',res.data.data)
                this.editFormInfo['permissionIds'] = this.permissionIds
                this.editFormInfo['teamIds'] = this.teamIds
              }
            })
      } else if (this.relatedName === 'user') {
        this.axios.get('/user/selectUserByIds',{params:{userIds:this.relatedValue.join(',')}})
        .then(res=>{
          if (res.data.code.toString() === '200'){
            this.$set(this.editFormInfo,'userList',res.data.data)
            this.editFormInfo['userIds'] = this.relatedValue
          }
        })
        .catch()
      }
    },
    closedTransfer(){
      this.relatedName = ''
    }
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
  .editDialog ::v-deep{
    .el-dialog__body{
      max-height: 650px;
      overflow: auto;
    }
  }

  .addForm {
    //border-bottom: 1px solid #dcdfe6;
    > .el-form-item {
      margin-bottom: 18px;
    }

    > .SelectTree-item::v-deep {
      .el-form-item__content {
        height: 32px;
      }
    }

    > .texArea {
      display: block;

      &::v-deep {
        margin-bottom: 0;

        .el-form-item__content {
          width: calc(100% - 80px);
        }
      }
    }
  }
}

.relatedDialog::v-deep {
  .el-transfer {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .el-transfer-panel__body {
    height: 350px;
  }

  .el-transfer-panel__list.is-filterable {
    height: 298px;
  }

  .el-transfer-panel {
    width: 239px;
  }
}

</style>