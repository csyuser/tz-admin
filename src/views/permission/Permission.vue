<template>
  <div class="permission-wrap">
    <el-form :inline="true" :model="searchData" class="demo-form-inline searchForm">
      <el-form-item>
        <el-input v-model="searchData.name" placeholder="输入名称" size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <Table :colsHead="colsHead" :allow-select="allowSelect" :tableDatas="tableDatas" @add="add" @update="update" @postSelect="selectRow" class="table"
           :pageSize="pageSize" :page="page" @currentChange="currentChange" @delete="deleteRows" @dblclick="view">
      <template #simple>
        <el-tabs v-model="activeName" @tab-click="handleClick" class="tab">
          <el-tab-pane label="权限管理" name="first"></el-tab-pane>
          <el-tab-pane label="权限组管理" name="second"></el-tab-pane>
        </el-tabs>
      </template>
    </Table>
    <el-dialog :title="dialogTitle" :visible.sync="editDialogVisible" width="710px" :before-close="handleClose"
               v-if="activeName === 'first'" @closed="closedDialog">
      <el-form label-position="right" label-width="110px" :inline="true" :model="editFormInfo" size="small"
               class="addForm" :disabled="editDialogDisabled" :rules="rules" ref="editDialog">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="editFormInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="权限类型" prop="type">
          <el-select v-model="editFormInfo.type">
            <el-option :label="item['dropName']" :value="item['id']" v-for="item in permissionTypeDrop"
                       :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="依赖菜单" prop="menuId" style="height: 32px" class="SelectTree-item">
          <SelectTree v-model="editFormInfo.menuId" :options="treeData" :props="defaultProps"
                      :disabled="editDialogDisabled"/>
        </el-form-item>
        <el-form-item label="是否需要范围" prop="isNeededScope">
          <el-switch v-model="editFormInfo['isNeededScope']" active-color="#13ce66" inactive-color="#ff4949"
                     active-value="1" inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="权限描述" class="texArea">
          <el-input v-model="editFormInfo.describe" type="textarea" :autosize="{ minRows: 4, maxRows: 4}"></el-input>
        </el-form-item>
      </el-form>
      <IconListDialog :type="dialogType" title-type="岗位" @update:relate="relatedPost" v-if="dialogType !== 'add'"
                      :iconDataList="editFormInfo['roleList']"></IconListDialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="small" v-if="dialogType!=='view'">取 消</el-button>
        <el-button type="primary" size="small" @click="confirmEdit">{{dialogType!=='view'?'确 定':'关 闭'}}</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="dialogTitle" :visible.sync="editDialogVisible" width="550px" :before-close="handleClose"
               v-if="activeName === 'second'" @closed="closedDialog">
      <el-form label-position="right" label-width="110px" :inline="true" :model="editFormInfo" size="small"
               class="addForm permissionTeam" :disabled="editDialogDisabled" :rules="rules" ref="editDialog">
        <el-form-item label="权限组名称" prop="teamName">
          <el-input v-model="editFormInfo['teamName']" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="相关权限">
          <el-input v-model="editFormInfo['permissionNameList']" suffix-icon="xxx" readonly @focus="openTree"></el-input>
        </el-form-item>
        <el-form-item label="权限描述" class="texArea">
          <el-input v-model="editFormInfo.describe" type="textarea" :autosize="{ minRows: 4, maxRows: 4}"></el-input>
        </el-form-item>
      </el-form>
      <IconListDialog :type="dialogType" title-type="岗位" @update:relate="relatedPost" v-if="dialogType !== 'add'"
                      :iconDataList="editFormInfo['roleList']"></IconListDialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="small" v-if="dialogType!=='view'">取 消</el-button>
        <el-button type="primary" size="small" @click="confirmEdit">{{dialogType!=='view'?'确 定':'关 闭'}}</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除权限" :visible.sync="deleteDialogVisible" width="650px" :before-close="handleClose">
      <DeleteRow @cancel="deleteDialogVisible = false" @confirm="confirmDelete"></DeleteRow>
    </el-dialog>
    <el-dialog :title="relatedTitle" :visible.sync="relatedDialogVisible" width="700px" append-to-body class="relatedDialog"
               :before-close="handleClose">
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
    <el-dialog title="选择权限" width="700px" append-to-body :before-close="handleClose" :visible="selectPermission" @opened="dialogOpened">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="small" style="margin-bottom: 15px"></el-input>
      <el-tree show-checkbox class="filter-tree" :data="permissionData" :props="defaultProps2" node-key="id"
               :filter-node-method="filterNode" ref="tree" @check="checkChange">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectPermission = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="treeConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Table from '@/components/Table'
import DeleteRow from '@/components/permission/DeleteRow'
import SelectTree from '@/components/permission/SelectTree'
import IconListDialog from '@/components/permission/dialog/IconListDialog'
import {mixins} from '@/mixins/mixins'

export default {
  name: 'Permission',
  components: {Table, DeleteRow, SelectTree, IconListDialog},
  mixins: [mixins],
  data() {
    return {
      colsHead: [{prop: 'name', label: '权限名称'}, {prop: 'typeName', label: '权限类型'}, {prop: 'describe', label: '权限描述'}],
      activeName: 'first',
      permissionData:[],
      selectPermission: false,
      filterText: '',
      checkedPermission: [],
      permissionIds:[],
      defaultProps2: {
        children: 'children',
        label: 'label'
      },
      allowSelect:true,
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    editFormInfo:{
      handler(newVal){
        if (newVal['permissionNameList'] instanceof Array){
          newVal['permissionNameList'] = newVal['permissionNameList'] && newVal['permissionNameList'].join(',')
        }
      },
      deep:true
    }
  },
  mounted() {
    this.getPages('/permission/page')
    this.axios.get('/menu/selectAllMenuTree')
        .then(res => {
          if (res.data.code.toString() === '200') {
            this.treeData = res.data.data
          } else {this.treeData = []}
        })
        .catch()
    this.getDropList('4')
  },
  methods: {
    currentChange(val, row) {
      this.currentPageChange(val, row, '/permission/page')
    },
//tab切换
    handleClick() {
      this.page = 1
      switch (this.activeName) {
        case 'first':
          this.allowSelect = true
          this.colsHead = [{prop: 'name', label: '权限名称'}, {prop: 'typeName', label: '权限类型'},
            {prop: 'describe', label: '权限描述'}]
          this.getPages('/permission/page')
          break
        case 'second':
          this.allowSelect = false
          this.colsHead = [{prop: 'teamName', label: '权限组名称'}, {prop: 'name', label: '权限名称'},
            {prop: 'describe', label: '权限描述'}]
          this.getPages('/team/page')
          break
        default:
          break
      }
    },
//权限组选择权限树结构
    filterNode(value, data) {
      if (!value) return true
      console.log('执行了')
      console.log(data)
      return data.label && data.label.indexOf(value) !== -1
    },
    openTree() {
      this.selectPermission = true
      this.axios.get('/permission/selectAll')
          .then(res=>{
            if (res.data.code.toString() === '200'){
              this.permissionData = res.data.data
            }
          }).catch()
    },
    dialogOpened(){
      this.permissionIds.length>=1 && this.$refs.tree.setCheckedKeys(this.permissionIds);
    },
    checkChange() {
      this.checkedPermission = this.$refs.tree.getCheckedNodes()
    },
    treeConfirm() {
      this.selectPermission = false
      let labels = []
      let ids = []
      this.checkedPermission.forEach(item=>{
        ids.push(item.id)
        labels.push(item.label)
      })
      this.permissionIds = ids
      this.$set(this.editFormInfo, 'permissionNameList',  labels)
    },
//表格增删改查
    selectRow(val) {
      this.selectedRows(val)
    },
    search() {
      switch (this.activeName) {
        case 'first':
          this.searchRow('/permission/page')
          break
        case 'second':
          this.searchRow('/team/page')
          break
        default:
          break
      }
    },
    add() {
      this.permissionIds = []
      this.dialogTitle = '新增权限'
      this.addRow()
    },
    update() {
      switch (this.activeName) {
        case 'first':
          this.dialogTitle = '编辑权限'
          this.updateRow2("permissionId",'/permission/selectPermissionInfo')
          break
        case 'second':
          this.dialogTitle = '编辑权限组'
          this.updateRow2("teamId",'/team/selectTeamInfo')
          break
        default:
          break
      }
    },
    confirmEdit() {
      switch (this.activeName) {
        case 'first':
          this.confirmEditRow('/permission/save', '/permission/page')
          break
        case 'second':
          this.editFormInfo.permissionNameList = this.editFormInfo.permissionNameList.split(',')
          this.confirmEditRow('/team/save', '/team/page')
          break
        default:
          break
      }
    },
    view(row) {
      switch (this.activeName) {
        case 'first':
          this.dialogTitle = '查看权限信息'
          this.viewRow2(row,"permissionId",'/permission/selectPermissionInfo')
          break
        case 'second':
          this.dialogTitle = '查看权限组信息'
          this.viewRow2(row,"teamId",'/team/selectTeamInfo')
          break
        default:
          break
      }
    },
    deleteRows() {
      this.deleteRow()
    },
    confirmDelete() {
      switch (this.activeName) {
        case 'first':
          this.confirmDeleteRow('/permission/delete', '/permission/page')
          break
        case 'second':
          this.confirmDeleteRow('/team/delete', '/team/page')
          break
        default:
          break
      }
    },
//关联权限范围，岗位，小组
    relatedPost() {
      this.relatedName = 'post'
      let type
      switch (this.activeName) {
        case 'first':
          type = '1'
          break
        case 'second':
          type = '2'
          break
        default:
          break
      }
      this.related('/permission-relation/selectPermissionAndRole', '关联岗位', {
        permissionId: this.selectedRow[0] && this.selectedRow[0].id,
        type:type
      })
    },
    confirmTransform() {
      let dialogUrl = ''
      let dialogParams = ''
      let relationType
      switch (this.activeName) {
        case 'first':
          dialogUrl = '/permission/selectPermissionInfo'
          dialogParams = {permissionId: this.selectedRow[0] && this.selectedRow[0].id}
          relationType = '1'
          break
        case 'second':
          relationType = '2'
          dialogUrl = '/team/selectTeamInfo'
          dialogParams = {teamId: this.selectedRow[0] && this.selectedRow[0].id}
          break
        default:
          break
      }
      this.confirmRelate('/permission-relation/saveTeamAndPermission', {
        type: '1',
        permissionIds: [this.selectedRow[0].id],
        relationIds: this.relatedValue,
        relationType: relationType
      },dialogParams,dialogUrl)
    },
  },

}
</script>


<style scoped lang='scss'>
.permission-wrap {
  padding: 20px;

  .addForm {
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
        .el-form-item__content {
          width: calc(100% - 110px);
        }
      }
    }

  }

  .permissionTeam {
    > .el-form-item::v-deep {
      input, textarea {
        width: 370px
      }
    }
  }

  .selectPermission {
    > h4 {
      font-size: 16px;
      color: #606266;
      font-weight: normal;
      margin-bottom: 15px;
    }
  }

  .tab {
    margin-bottom: -10px;

    &::v-deep {
      .el-tabs__header {
        margin-bottom: 0
      }
    }
  }
}
.relatedDialog::v-deep{
  .el-transfer{
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
  .el-transfer-panel{
    width: 239px;
  }
}
</style>