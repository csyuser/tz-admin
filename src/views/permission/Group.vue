<template>
  <div class="group-wrap">
    <el-form :inline="true" :model="searchData" class="demo-form-inline searchForm">
      <el-form-item>
        <el-input v-model="searchData.name" placeholder="输入名称或邮箱搜索" size="small"></el-input>
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
      <el-form label-position="right" label-width="85px" :inline="true" :model="editFormInfo" size="small" ref="addForm"
               class="addForm"
               :disabled="editDialogDisabled">
        <el-form-item label="小组名称">
          <el-input v-model="editFormInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="小组编号">
          <el-input v-model="editFormInfo.code" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" class="departmentItem">
          <el-input readonly v-model="editFormInfo.departmentName" :suffix-icon="iconName" @focus="focus" @blur="blur" placeholder="请选择"
                    ref="treeInput"></el-input>
          <el-tree :data="data" :props="defaultProps" @node-click="select" class="tree" :class="{treeVisible}"
                   @node-expand="treeNode" @node-collapse="treeNode"></el-tree>
        </el-form-item>
        <el-form-item label="小组描述">
          <el-input v-model="editFormInfo.describe" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort" :rules="{ type: 'number', message: '排序必须为数字值'}">
          <el-input v-model.number="editFormInfo.sort" suffix-icon="xxx"></el-input>
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
  name: 'Group',
  components: {Table, DeleteRow, SvgIcon},
  mixins:[mixins],
  data() {
    return {
      colsHead: [{prop: 'name', label: '小组名称'}, {prop: 'code', label: '小组编号'}, {prop: 'departmentName', label: '所属部门'},
        {prop: 'describe', label: '小组描述'}, {prop: 'sort', label: '排序'}, {prop: 'valid', label: '是否有效'},],
      data: [],
      defaultProps: {
        children: 'child',
        label: 'name'
      },
    }
  },
  mounted() {
    this.getPages('/team/page')
    this.axios.get(this.prefixAddr + '/department/selectDepartmentTree')
        .then(res => {
          if (res.data.code.toString() === '200') {
            this.data = res.data.data
          } else {this.data = []}
        })
        .catch()
  },
  methods: {
    currentChange(val, row) {
      this.currentPageChange(val, row, '/team/page')
    },
    //表格增删改查
    selectRow(val) {
      this.selectedRows(val)
    },
    search() {
      this.searchRow('/team/page')
    },
    add() {
      this.dialogTitle = '新增小组'
      this.addRow()
    },
    update() {
      this.dialogTitle = '编辑小组'
      this.updateRow()
    },
    confirmEdit() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.confirmEditRow('/team/save', '/team/page')
        } else {
          console.log('error submit!!')
          return false
        }
      })

    },
    view(row) {
      this.dialogTitle = '查看小组信息'
      this.viewRow(row)
    },
    deleteRows() {
      this.deleteRow()
    },
    confirmDelete() {
      this.confirmDeleteRow('/team/delete', '/team/page')
    },
//关联用户，权限
    relatedUser() {
      this.relatedName = 'user'
      this.related('/team/selectTeamAndUser','关联用户',{teamId:this.selectedRow[0] && this.selectedRow[0].id})
    },
    relatedPermission() {
      this.relatedName = 'permission'
      this.related('','关联权限',{teamId:this.selectedRow[0] && this.selectedRow[0].id})
    },
    confirmTransform() {
      if (this.relatedName === 'permission'){this.confirmRelate('', {
        type: '',
        // userIds: [this.selectedRow[0].id],
        // roleIds: this.relatedValue
      })}
      else if (this.relatedName === 'user'){this.confirmRelate('/team/saveUserAndTeam',{
        type:'1',
        teamIds:[this.selectedRow[0].id],
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
      this.editFormInfo.departmentName = data.name
      this.editFormInfo.departmentId = data.id
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
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      }

      .treeVisible {
        display: block;
      }
    }

  }
}
</style>