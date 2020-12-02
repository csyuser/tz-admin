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
    <Table :colsHead="colsHead" :tableDatas="tableDatas" @add="add" @update="update" @postSelect="selectRow"
           :pageSize="pageSize" :page="page" @currentChange="currentChange" @delete="deleteRows" @dblclick="view">
      <el-button size="small" class="update" @click="relatedPermission">
        <SvgIcon icon-name="permission"></SvgIcon>
        关联权限范围
      </el-button>
      <el-button size="small" class="update" @click="relatedPost">
        <SvgIcon icon-name="post"></SvgIcon>
        关联岗位
      </el-button>
      <el-button size="small" class="update" @click="relatedGroup">
        <SvgIcon icon-name="group"></SvgIcon>
        关联小组
      </el-button>
    </Table>
    <el-dialog :title="dialogTitle" :visible.sync="editDialogVisible" width="700px">
      <el-form label-position="right" label-width="100px" :inline="true" :model="editFormInfo" size="small"
               class="addForm"
               :disabled="editDialogDisabled">
        <el-form-item label="权限名称">
          <el-input v-model="editFormInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="权限类型">
          <el-select v-model="editFormInfo.type">
            <el-option :label="item['dropName']" :value="item['id']" v-for="item in permissionTypeDrop" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="editFormInfo.describe" suffix-icon="xxx"></el-input>
        </el-form-item>
        <!--        <el-form-item label="依赖菜单ID">-->
        <!--          <el-input v-model="editFormInfo.menuId" suffix-icon="xxx"></el-input>-->
        <!--        </el-form-item>-->
        <el-form-item label="依赖菜单" class="departmentItem">
          <el-input v-model="editFormInfo.menuName" readonly :suffix-icon="iconName" @focus="focusDepartment"
                    @blur="blurDepartment" ref="treeInput"></el-input>
          <el-tree :data="treeData" :props="defaultProps" @node-click="selectDepartment" class="tree" :class="{treeVisible}"
                   @node-expand="treeNode" @node-collapse="treeNode"></el-tree>
        </el-form-item>
        <el-form-item label="是否需要范围">
          <el-switch v-model="editFormInfo['isNeededScope']" active-color="#13ce66" inactive-color="#ff4949"
                     active-value="1" inactive-value="0">
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="confirmEdit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除权限" :visible.sync="deleteDialogVisible" width="650px">
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
import SvgIcon from '@/components/SvgIcon'
import DeleteRow from '@/components/permission/DeleteRow'
import {mixins} from '@/mixins/mixins'

export default {
  name: 'Permission',
  components: {Table, SvgIcon, DeleteRow},
  mixins: [mixins],
  data() {
    return {
      colsHead: [{prop: 'name', label: '权限名称'}, {prop: 'type', label: '权限类型'}, {prop: 'describe', label: '权限描述'}],
      transformData: [],
      value: [],
      filterMethod(query, item) {
        return item.label.indexOf(query) > -1
      },
      relatedTitle: '',
      relatedDialogVisible: false,
      permissionVal: [],
      postVal: [],
      groupVal: [],
      transformType: '',
    }
  },
  mounted() {
    this.getPages('/permission/page')
    this.axios.get(this.prefixAddr + '/menu/selectMenuTree')
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
//表格增删改查
    selectRow(val) {
      this.selectedRows(val)
    },
    search() {
      this.searchRow('/permission/page')
    },
    add() {
      this.dialogTitle = '新增权限'
      this.addRow()
    },
    update() {
      this.dialogTitle = '编辑权限'
      this.updateRow()
    },
    confirmEdit() {
      this.confirmEditRow('/permission/save', '/permission/page')
    },
    view(row) {
      this.dialogTitle = '查看权限信息'
      this.viewRow(row)
    },
    deleteRows() {
      this.deleteRow()
    },
    confirmDelete() {
      this.confirmDeleteRow('/permission/delete', '/permission/page')
    },
//数据下拉树
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
      this.editFormInfo.menuName = data.name
      this.editFormInfo.menuId = data.id
    },
//关联权限范围，岗位，小组
    relatedPermission() {
      this.value = this.permissionVal
      this.transformType = 'permission'
      this.relatedTitle = '关联权限范围'
      this.relatedDialogVisible = true
      this.transformData = [{label: '前端', key: '前端',}, {label: '后端', key: '后端'}, {label: '测试', key: '测试'},
        {label: 'ui', key: 'ui'}]
    },
    relatedPost() {
      this.value = this.postVal
      this.transformType = 'post'
      this.relatedTitle = '关联岗位'
      this.relatedDialogVisible = true
      this.transformData = [{label: '小组1', key: '小组1',}, {label: '小组2', key: '小组2'}, {label: '小组3', key: '小组3'},
        {label: '小组4', key: '小组4'}]
    },
    relatedGroup() {
      this.value = this.groupVal
      this.transformType = 'group'
      this.relatedTitle = '关联小组'
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
  }
}
</script>


<style scoped lang='scss'>
.permission-wrap {
  padding: 20px;
  .addForm {
    > .el-form-item {
      margin-bottom: 18px;
    }
    .departmentItem{
      position: relative;
      .tree{
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
      .treeVisible{
        display: block;
      }
    }

  }
}
</style>