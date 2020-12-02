<template>
  <div class="user-manage-wrap">
    <el-form :inline="true" :model="searchData" class="demo-form-inline searchForm">
      <el-form-item>
        <el-input v-model="searchData.name" placeholder="输入名称" size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" size="small">查询</el-button>
      </el-form-item>
    </el-form>
    <Table :colsHead="colsHead" :tableDatas="tableDatas" :pageSize="pageSize" :page="page"
           @currentChange="currentChange"
           @add="add" @update="update" @postSelect="selectRow" @delete="deleteRows" @dblclick="view">
      <el-button size="small" class="update" @click="relatedPost">
        <SvgIcon icon-name="post"></SvgIcon>
        关联岗位
      </el-button>
      <el-button size="small" class="update" @click="relatedGroup">
        <SvgIcon icon-name="group"></SvgIcon>
        关联小组
      </el-button>
    </Table>
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
    <el-dialog :title="dialogTitle" :visible.sync="editDialogVisible" width="660px">
      <el-form label-position="right" label-width="85px" :inline="true" :model="editFormInfo" size="small"
               class="addForm" :disabled="editDialogDisabled">
        <el-form-item label="用户名称">
          <el-input v-model="editFormInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="人员编号">
          <el-select v-model="editFormInfo.code">
            <el-option :label="code.code" :value="code.code" v-for="code in userCodes" :key="code.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户密码">
            <el-input v-model="editFormInfo.password" show-password suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="风险等级">
          <el-select v-model="editFormInfo.riskLevel">
            <el-option label="异地登录" value="1"></el-option>
            <el-option label="频繁登录" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户状态">
          <el-select v-model="editFormInfo.status">
            <el-option label="正常" value="1"></el-option>
            <el-option label="锁定" value="2"></el-option>
            <el-option label="注销" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门" class="departmentItem">
          <el-input readonly v-model="editFormInfo.departmentName" :suffix-icon="iconName" @focus="focus" @blur="blur"
                    ref="treeInput" placeholder="请选择"></el-input>
          <el-tree :data="data" :props="defaultProps" @node-click="select" class="tree" :class="{treeVisible}"
                   @node-expand="treeNode" @node-collapse="treeNode"></el-tree>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="confirmEdit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除用户" :visible.sync="deleteDialogVisible" width="650px">
      <DeleteRow @cancel="deleteDialogVisible = false" @confirm="confirmDelete"></DeleteRow>
    </el-dialog>
  </div>
</template>

<script>
// import Qs from 'qs'
import Table from '@/components/permission/Table'
import SvgIcon from '@/components/SvgIcon'
import DeleteRow from '@/components/permission/DeleteRow'
import {mixins} from '@/mixins/mixins'

export default {
  name: 'userManage',
  components: {Table, SvgIcon, DeleteRow},
  mixins:[mixins],
  data() {
    return {
      colsHead: [{prop: 'name', label: '用户名'}, {prop: 'code', label: '编号'}, {prop: 'departmentName', label: '部门'},
        {prop: 'riskLevel', label: '风险等级'}, {prop: 'status', label: '用户状态'}],
      data: [],
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      deleteIds: [],
      dialogType: '',
      userCodes: [],
      relatedName:''
    }
  },
  mounted() {
    this.getPages('/user/page')
    this.axios.get(this.prefixAddr + '/department/selectDepartmentTree')
        .then(res => {
          if (res.data.code.toString() === '200') {
            this.data = res.data.data
          } else {this.data = []}
        })
        .catch()
    this.axios.get(this.prefixAddr + '/dropList/selectPerson')
        .then(res => {
          if (res.data.code.toString() === '200') {
            this.userCodes = res.data.data
          } else {this.userCodes = []}
        })
        .catch()
  },
  methods: {
    currentChange(val, row) {
      this.currentPageChange(val, row, '/user/page')
    },
//关联部门，岗位，小组
    relatedPost() {
      this.relatedName = 'post'
      this.related('/user/selectUserAndRole','关联岗位', {userId: this.selectedRow[0] && this.selectedRow[0].id})
    },
    relatedGroup() {
      this.relatedName = 'group'
      this.related('/user/selectUserAndTeam','关联小组',{userId: this.selectedRow[0] && this.selectedRow[0].id})
    },
    confirmTransform() {
      if (this.relatedName === 'post'){this.confirmRelate('/role/saveUserRole', {
        type: '0',
        userIds: [this.selectedRow[0].id],
        roleIds: this.relatedValue
      })}
      else if (this.relatedName === 'group'){this.confirmRelate('/team/saveUserAndTeam',{
        type:'0',
        userIds:[this.selectedRow[0].id],
        teamIds:this.relatedValue
      })}

    },
//用户的增删改查
    selectRow(val) {
      this.selectedRows(val)
    },
    search() {
      this.searchRow('/user/page')
    },
    add() {
      this.dialogTitle = '新增用户'
      this.addRow()
    },
    update() {
      this.dialogTitle = '编辑用户'
      this.updateRow()
    },
    confirmEdit() {
      this.confirmEditRow('/user/save', '/user/page')
    },
    view(row) {
      this.dialogTitle = '查看用户信息'
      this.viewRow(row)
    },
    deleteRows() {
      this.deleteRow()
    },
    confirmDelete() {
      this.confirmDeleteRow('/user/delete', '/user/page')
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
  },
}
</script>

<style scoped lang='scss'>
.user-manage-wrap {
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
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      }

      .treeVisible {
        display: block;
      }
    }

  }
}

</style>