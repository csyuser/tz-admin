<template>
  <div class="permission-wrap">
    <el-form :inline="true" :model="searchData" class="demo-form-inline searchForm" size="small">
      <el-form-item v-if="this.activeName!=='third'">
        <el-input v-model="searchData.name" placeholder="输入名称"></el-input>
      </el-form-item>
      <el-form-item label="部门名称" :style="{height: '32px',marginTop:'1px'}" class="SelectTree-item"
                    v-if="this.activeName==='third'">
        <SelectTree v-model="searchData.departmentId" :options="treeData" :props="defaultProps" placeholder="选择部门"
                    @selected="selectDepartment"/>
      </el-form-item>
      <el-form-item label="岗位名称" v-if="this.activeName==='third'">
        <el-select v-model="searchData.roleId" placeholder="选择岗位" size="small" :disabled="!searchData.departmentId">
          <el-option :label="item.name" :value="item['id']" v-for="item in postList"
                     :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <Table :colsHead="colsHead" :tableDatas="tableDatas" @add="add" @update="update" @postSelect="selectRow"
           @permissionRange="setRange"
           class="table" :allow-select="false" :button-list="buttonList"
           :pageSize="pageSize" :page="page" @currentChange="currentChange" @delete="deleteRows" @dblclick="view">
      <template #simple>
        <el-tabs v-model="activeName" @tab-click="handleClick" class="tab">
          <el-tab-pane label="权限管理" name="first"></el-tab-pane>
          <el-tab-pane label="权限组管理" name="second"></el-tab-pane>
          <el-tab-pane label="权限范围管理" name="third"></el-tab-pane>
        </el-tabs>
      </template>
    </Table>
    <el-dialog :title="dialogTitle" :visible.sync="editDialogVisible" width="710px" :before-close="handleClose"
               v-if="activeName === 'first'" @closed="closedDialog">
      <el-form label-position="right" label-width="110px" :inline="true" :model="editFormInfo" size="small"
               class="addForm" :disabled="editDialogDisabled" :rules="rules" ref="editDialog">
        <el-form-item label="权限类型" prop="type">
          <el-radio-group v-model="editFormInfo['type']">
            <el-radio :label="item['dropSort']" v-for="item in permissionTypeDrop" :key="item.id">
              {{ item['dropName'] }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="editFormInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="依赖菜单" prop="menuId" style="height: 32px" class="SelectTree-item">
          <SelectTree v-model="editFormInfo.menuId" :options="allMenuTree" :props="defaultProps" @selected="selectMenu"
                      :disabled="editDialogDisabled"/>
        </el-form-item>
        <el-form-item label="依赖功能" prop="controlId" style="height: 32px" class="SelectTree-item"
                      v-if="editFormInfo.menuId && editFormInfo.type ==='2'">
          <el-select v-model="editFormInfo.controlId">
            <el-option :label="item.name" :value="item.id" v-for="item in controlList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="依赖字段" prop="fieldId" style="height: 32px" class="SelectTree-item"
                      v-if="editFormInfo.menuId && editFormInfo.type ==='3'">
          <el-select v-model="editFormInfo.fieldId">
            <el-option :label="item['fieldName']" :value="item.id" v-for="item in fieldList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否需要范围" prop="isNeededScope" v-if="editFormInfo.type==='1'">
          <el-switch v-model="editFormInfo['isNeededScope']" active-color="#13ce66" inactive-color="#ff4949"
                     active-value="1" inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="权限描述" class="texArea">
          <el-input v-model="editFormInfo.describe" type="textarea" :autosize="{ minRows: 4, maxRows: 4}"></el-input>
        </el-form-item>
      </el-form>
      <IconListDialog :type="dialogType" title-type="岗位" @update:relate="relatedPost"
                      :needBtn="showDialogBtn('relatePost')"
                      :iconDataList="editFormInfo['roleList']"></IconListDialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="small" v-if="dialogType!=='view'">取 消</el-button>
        <el-button type="primary" size="small"
                   @click="confirmEdit">{{ dialogType !== 'view' ? '确 定' : '关 闭' }}</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="dialogTitle" :visible.sync="editDialogVisible" width="550px" :before-close="handleClose"
               v-if="activeName === 'second'" @closed="closedDialog">
      <el-form label-position="right" label-width="110px" :inline="true" :model="editFormInfo" size="small"
               class="addForm permissionTeam" :disabled="editDialogDisabled" :rules="rules" ref="editDialog">
        <el-form-item label="权限组名称" prop="teamName">
          <el-input v-model="editFormInfo['teamName']" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="相关权限" prop="permissionNameList">
          <el-input v-model="editFormInfo['permissionNameList']" suffix-icon="xxx" readonly
                    @focus="openTree('permission')"></el-input>
        </el-form-item>
        <el-form-item label="权限描述" class="texArea">
          <el-input v-model="editFormInfo.describe" type="textarea" :autosize="{ minRows: 4, maxRows: 4}"></el-input>
        </el-form-item>
      </el-form>
      <IconListDialog :type="dialogType" title-type="岗位" @update:relate="relatedPost"
                      :needBtn="showDialogBtn('relatePost')"
                      :iconDataList="editFormInfo['roleList']"></IconListDialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="small" v-if="dialogType!=='view'">取 消</el-button>
        <el-button type="primary" size="small"
                   @click="confirmEdit">{{ dialogType !== 'view' ? '确 定' : '关 闭' }}</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="dialogTitle" :visible.sync="editDialogVisible" width="1085px"  top="10vh" :before-close="handleClose" class="editDialog"
               v-if="activeName === 'third'" @closed="closedDialog">
      <div class="settings">
        <div class="department-wrap wrap">
          <el-form label-width="70px" :inline="true" :model="editFormInfo" size="small"
                   class="addForm permissionTeam" ref="editDialog">
            <el-form-item label="设置部门">
              <el-input v-model="editFormInfo['departmentNames']" suffix-icon="xxx"></el-input>
            </el-form-item>
          </el-form>
          <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="small" style="margin-bottom: 15px;width:440px"></el-input>
          <el-tree show-checkbox class="filter-tree" :data="departmentTreeData" :props="defaultProps3" node-key="id"
                   :filter-node-method="filterNode" ref="departmentTree" @check="checkChange('department')">
          </el-tree>
        </div>
        <div class="xzqh-wrap wrap">
          <el-form label-width="100px" :inline="true" :model="editFormInfo" size="small"
                   class="addForm permissionTeam" ref="editDialog">
            <el-form-item label="设置行政区划">
              <el-input v-model="editFormInfo['xzqh']" suffix-icon="xxx"></el-input>
            </el-form-item>
          </el-form>
          <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="small" style="margin-bottom: 15px;width: 470px"></el-input>
          <el-tree show-checkbox class="filter-tree xzqhTree" :data="xzqhTreeData" :props="defaultProps2" node-key="id"
                   :filter-node-method="filterNode" ref="xzqhTree" @check="checkChange('xzqh')">
          </el-tree>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="small" v-if="dialogType!=='view'">取 消</el-button>
        <el-button type="primary" size="small"
                   @click="confirmEdit">{{ dialogType !== 'view' ? '确 定' : '关 闭' }}</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除权限" :visible.sync="deleteDialogVisible" width="650px" :before-close="handleClose">
      <DeleteRow @cancel="deleteDialogVisible = false" @confirm="confirmDelete"></DeleteRow>
    </el-dialog>
    <el-dialog :title="relatedTitle" :visible.sync="relatedDialogVisible" width="700px" append-to-body
               class="relatedDialog"
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
    <el-dialog title="选择权限" width="700px" append-to-body :before-close="handleClose" :visible="selectPermission"
               @opened="dialogOpened('permission')">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="small" style="margin-bottom: 15px"></el-input>
      <el-tree show-checkbox class="filter-tree" :data="permissionData" :props="defaultProps2" node-key="id"
               :filter-node-method="filterNode" ref="tree" @check="checkChange('permission')">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectPermission = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="treeConfirm('permission')">确 定</el-button>
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
      rules: {
        controlId: [{required: true, message: '依赖功能不能为空', trigger: 'change'}],
        fieldId: [{required: true, message: '依赖字段不能为空', trigger: 'change'}],
        menuId: [{required: true, message: '依赖菜单不能为空', trigger: 'change'}],
        teamName: [{required: true, message: '名称不能为空', trigger: 'blur'}],
        permissionNameList: [{required: true, message: '相关权限不能为空', trigger: 'change'}],
        isNeededScope: [{required: true, message: '是否需要范围必须', trigger: 'change'}],
      },
      activeName: 'first',
      permissionData: [],
      selectPermission: false,
      filterText: '',
      checkedPermission: [],
      permissionIds: [],
      defaultProps2: {
        children: 'children',
        label: 'label'
      },
      defaultProps3: {
        children: 'children',
        label: 'name'
      },
      controlList: [],
      fieldList: [],
      allMenuTree: [],
      postList: [],
      rangeDialogVisible: false,
      departmentTreeData: [],
      // dialogTreeData: [],
      checkedDepartment: [],
      departmentIds: [],
      xzqhTreeData: [],
      checkedXzqh: [],
      xzqhIds: [],
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    editFormInfo: {
      handler(newVal) {
        if (newVal['permissionNameList'] instanceof Array) {
          newVal['permissionNameList'] = newVal['permissionNameList'] && newVal['permissionNameList'].join(',')
        }
        if (newVal.type === '2' || newVal.type === '3') {
          if (!newVal.menuId || newVal.menuId === '') return
          this.typeChange()
        }
      },
      deep: true
    }
  },
  mounted() {
    this.tabId = 'permission'
    this.getButtonList()
    this.getPages('/permission/page')
    this.axios.get('/menu/selectAllMenuTree')
        .then(res => {
          if (res.data.code.toString() === '200') {
            this.allMenuTree = res.data.data
          } else {this.allMenuTree = []}
        })
        .catch()
    this.getDropList('4')
    this.getDepartmentTree('/department/selectDepartmentTree')
  },
  methods: {
    currentChange(val, row) {
      this.currentPageChange(val, row, '/permission/page')
    },
//根据部门查岗位
    selectDepartment() {
      this.axios.get('department/selectRoleById', {params: {id: this.searchData.departmentId}})
          .then(res => {
            if (res.data.code.toString() === '200') {
              this.postList = res.data.data
            }
          })
          .catch()
    },
//根据不同的上级菜单选择依赖功能和字段
    selectMenu() {
      this.typeChange()
    },
    typeChange() {
      switch (this.editFormInfo.type) {
        case '2':
          this.getList('/menu/selectButtonMenuByParentId', '2')
          break
        case '3':
          this.getList('/system-field/selectFieldMenuByParentId', '3')
          break
        default:
          break
      }
    },
    getList(url, type) {
      this.controlList = []
      this.fieldList = []
      this.axios.get(url, {params: {parentId: this.editFormInfo.menuId}})
          .then(res => {
            if (res.data.code.toString() === '200') {
              if (type === '2') {this.controlList = res.data.data} else if (type === '3') {this.fieldList = res.data.data}
            }
          })
          .catch()
    },
//tab切换
    handleClick() {
      this.page = 1
      this.tableDatas = {}
      switch (this.activeName) {
        case 'first':
          this.colsHead = [{prop: 'name', label: '权限名称'}, {prop: 'typeName', label: '权限类型'},
            {prop: 'describe', label: '权限描述'}]
          this.tabId = 'permission'
          this.getButtonList()
          this.getPages('/permission/page')
          break
        case 'second':
          this.colsHead = [{prop: 'teamName', label: '权限组名称'}, {prop: 'name', label: '权限名称'},
            {prop: 'describe', label: '权限描述'}]
          this.tabId = 'permission'
          this.getButtonList()
          this.getPages('/team/page')
          break
        case 'third':
          this.colsHead = [{prop: 'permissionName', label: '权限名称'}, {prop: 'roleName', label: '岗位名称'},
            {prop: 'xzqhName', label: '行政区划范围'}, {prop: 'departmentName', label: '部门范围'},
            {prop: 'describe', label: '权限描述'}]
          this.tabId = 'permissionRange'
          this.getButtonList()
          break
        default:
          break
      }
    },
//权限组选择权限树结构
    filterNode(value, data) {
      if (!value) return true
      return data && data.label && data.label.indexOf(value) !== -1
    },
    openTree(type) {
      switch (type) {
        case 'permission':
          this.selectPermission = true
          this.axios.get('/permission/selectAll')
              .then(res => {
                if (res.data.code.toString() === '200') {
                  this.permissionData = res.data.data
                }
              }).catch()
          break
        case 'department':
          this.axios.get('/department/selectDepartmentTree')
              .then(res => {
                if (res.data.code.toString() === '200') {
                  this.departmentTreeData = res.data.data
                  console.log(this.departmentTreeData)
                }
              }).catch()
          break
        case 'xzqh':
          this.axios.get('/xzqh/selectXzqhTree')
              .then(res => {
                if (res.data.code.toString() === '200') {
                  this.xzqhTreeData = res.data.data
                }
              }).catch()
          break
      }

    },
    dialogOpened(type) {
      this.setDefaultChecked(type)
    },
    checkChange(type) {
      switch (type) {
        case 'permission':
          this.checkedPermission = this.$refs.tree.getCheckedNodes()
          break
        case 'department':
          this.checkedDepartment = this.$refs.departmentTree.getCheckedNodes()
          this.getCheckedTree('department', this.checkedDepartment, 'departmentNames')
          break
        case 'xzqh':
          this.checkedXzqh = this.$refs.xzqhTree.getCheckedNodes()
          this.getCheckedTree('xzqh', this.checkedXzqh, 'xzqh')
          break
      }
    },
    treeConfirm(type) {
      switch (type) {
        case 'permission':
          this.selectPermission = false
          this.getCheckedTree('permission', this.checkedPermission, 'permissionNameList')
          break
        case 'department':
          this.departmentTree = false
          this.departmentIds = this.getCheckedTree('department', this.checkedDepartment, 'departmentNames')
          break
        case 'xzqh':
          this.xzqhTree = false
          this.xzqhIds = this.getCheckedTree('xzqh', this.checkedXzqh, 'xzqh')
          break
      }
    },
    getCheckedTree(type, checked, editName) {
      let labels = []
      let ids = []
      checked.forEach(item => {
        if (type === 'department') {
          ids.push(item.id)
          labels.push(item.name)
        } else {
          ids.push(item.id)
          labels.push(item.label)
        }
      })
      this.$set(this.editFormInfo, editName, labels.join(','))
      return ids
    },
    setDefaultChecked(type) {
      switch (type) {
        case 'permission':
          this.$refs.tree.setCheckedKeys(this.permissionIds)
          setTimeout(()=>{
            this.checkedPermission = this.$refs.tree.getCheckedNodes()
          },10)
          break
        case 'department':
          this.$refs.departmentTree.setCheckedKeys(this.departmentIds)
          setTimeout(()=>{
            this.checkedDepartment = this.$refs.departmentTree.getCheckedNodes()
          },10)
          break
        case 'xzqh':
          this.$refs.xzqhTree.setCheckedKeys(this.xzqhIds)
          setTimeout(()=>{
            this.checkedXzqh = this.$refs.xzqhTree.getCheckedNodes()
          },10)
          break
      }
      // if (ids.length) {
      //   this.$refs[treeName].setCheckedKeys(this.permissionIds)
      //   setTimeout(()=>{
      //     checkedData = this.$refs.tree.getCheckedNodes()
      //     console.log(this.$refs.tree.getCheckedNodes())
      //   },10)
      // } else {
      //   this.$refs[treeName].setCheckedKeys([])
      //   checkedData = []
      //   // this.checkedPermission = []
      // }
      // return checkedData
    },
//设置权限范围
    setRange() {
      if (this.selectedRow.length === 1) {
        this.dialogTitle = '设置权限范围'
        this.editFormInfo = {}
        this.editDialogVisible = true
        this.dialogType = 'update'
        this.editDialogDisabled = false
        this.openTree('department')
        this.openTree('xzqh')
        this.axios.get('/permission-range/selectPermissionRangeInfo', {
          params: {
            roleId: this.selectedRow[0].roleId,
            permissionId: this.selectedRow[0].id,
          }
        }).then(res => {
          if (res.data.code.toString() === '200') {
            this.departmentIds = res.data.data['checkDepartmentList']
            this.xzqhIds = res.data.data['checkXzqhList']
            this.$set(this.editFormInfo, 'departmentNames', res.data.data['checkDepartmentNames'].join(','))
            this.$set(this.editFormInfo, 'xzqh', res.data.data['checkXzqhNames'].join(','))
            this.dialogOpened('departmentNames')
            this.dialogOpened('xzqh')
          }
        })
            .catch()
      } else {
        this.$message.error('请选择一行数据')
      }
      // this.updateRow2('permissionId', '/permission-range/selectPermissionRangeInfo')
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
        case 'third':
          this.searchRow('/permission-range/selectPermissionRange')
          break
        default:
          break
      }
    },
    add() {
      this.permissionIds = []
      this.dialogTitle = this.activeName === 'first' ? '新增权限' : '新增权限组'
      this.addRow()
      this.editFormInfo.isNeededScope = '0'
    },
    update() {
      switch (this.activeName) {
        case 'first':
          this.dialogTitle = '编辑权限'
          this.updateRow2('permissionId', '/permission/selectPermissionInfo')
          break
        case 'second':
          this.dialogTitle = '编辑权限组'
          this.updateRow2('teamId', '/team/selectTeamInfo')
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
          // this.editFormInfo.permissionNameList = this.editFormInfo.permissionNameList && this.editFormInfo.permissionNameList.split(',')
          this.editFormInfo.permissionIds = this.permissionIds
          this.confirmEditRow('/team/save', '/team/page')
          break
        case 'third':
          // this.editFormInfo.departmentNames = this.editFormInfo.departmentNames && this.editFormInfo.departmentNames.split(',')
          // this.editFormInfo.xzqh = this.editFormInfo.xzqh && this.editFormInfo.xzqh.split(',')
          this.editFormInfo.departmentIds = this.departmentIds
          this.editFormInfo.xzqhIds = this.xzqhIds
          this.editFormInfo.permissionId = this.selectedRow[0].id
          this.editFormInfo.roleId = this.selectedRow[0].roleId
          this.confirmEditRow('/permission-range/savePermissionRange', '/permission-range/selectPermissionRange')
          break
        default:
          break
      }
    },
    view(row) {
      switch (this.activeName) {
        case 'first':
          this.dialogTitle = '查看权限信息'
          this.viewRow2(row, 'permissionId', '/permission/selectPermissionInfo')
          break
        case 'second':
          this.dialogTitle = '查看权限组信息'
          this.viewRow2(row, 'teamId', '/team/selectTeamInfo')
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
      let id = this.dialogType === 'add' ? '' : this.selectedRow[0] && this.selectedRow[0].id
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
        permissionId: id,
        type: type
      })
    },
    confirmTransform() {
      this.relatedDialogVisible = false
      this.axios.get('/role/selectRoleByIds', {params: {roleIds: this.relatedValue.join(',')}})
          .then(res => {
            if (res.data.code.toString() === '200') {
              this.$set(this.editFormInfo, 'roleList', res.data.data)
              this.editFormInfo['roleIds'] = this.relatedValue
            }
          })
    },
  },

}
</script>


<style scoped lang='scss'>
.permission-wrap {
  padding: 20px;

  > .searchForm {
    position: relative;

    > .selectInput {
      width: 100px;
    }

    &::v-deep {
      label {
        padding-right: 0.5em;
      }
    }

    .el-form-item {
      margin-right: 1em;
    }

    > .SelectTree-item::v-deep {
      .el-form-item__content {
        height: 32px;
      }
    }
  }

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

.editDialog ::v-deep {
  .el-dialog__body {
    max-height: 650px;
    overflow: auto;
    padding-bottom: 10px;
  }
}

.settings {
  display: flex;

  > .wrap {
    width: 48%;

    &.department-wrap {
      border-right: 1px solid #dcdfe6;
    }
    &.xzqh-wrap {
      padding-left: 20px;
      .xzqhTree{
        height: 450px;
        overflow: auto;
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