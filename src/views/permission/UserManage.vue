<template>
  <div class="user-manage-wrap">
    <el-form :inline="true" :model="formInline" class="demo-form-inline searchForm">
      <el-form-item>
        <el-input v-model="formInline.name" placeholder="输入名称" size="small"></el-input>
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
      <el-form label-position="right" label-width="85px" :inline="true" :model="userInfo" size="small"
               class="addForm" :disabled="editDialogDisabled">
        <el-form-item label="用户名称">
          <el-input v-model="userInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="人员编号">
          <el-select v-model="userInfo.code">
            <el-option :label="code.code" :value="code.code" v-for="code in userCodes" :key="code.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户密码">
            <el-input v-model="userInfo.password" show-password suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="风险等级">
          <el-select v-model="userInfo.riskLevel">
            <el-option label="异地登录" value="1"></el-option>
            <el-option label="频繁登录" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户状态">
          <el-select v-model="userInfo.status">
            <el-option label="正常" value="1"></el-option>
            <el-option label="锁定" value="2"></el-option>
            <el-option label="注销" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门" class="departmentItem">
          <el-input readonly v-model="userInfo.departmentName" :suffix-icon="iconName" @focus="focus" @blur="blur"
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
      page: 1,
      pageSize: 10,
      dialogTitle: '',
      colsHead: [{prop: 'name', label: '用户名'}, {prop: 'code', label: '编号'}, {prop: 'departmentName', label: '部门'},
        {prop: 'riskLevel', label: '风险等级'}, {prop: 'status', label: '用户状态'}],
      tableDatas: {},
      checkedLabels: [],
      checkedOptions: [],
      formInline: {
        name: '',
      },
      checkedProps: [],
      editDialogVisible: false,
      deleteDialogVisible: false,
      editDialogDisabled: false,
      userInfo: {},
      selectedRow: [],
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
    this.getPages()
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
    getPages(formInline) {
      this.axios.get(this.prefixAddr + '/user/page', {
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
//关联部门，岗位，小组
    relatedPost() {
      this.relatedName = 'post'
      this.related('/user/selectUserAndRole','关联岗位')
    },
    relatedGroup() {
      this.relatedName = 'group'
      this.related('/user/selectUserAndTeam','关联小组')
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
      this.dialogTitle = '增加用户'
      this.userInfo = {}
      this.editDialogDisabled = false
      this.editDialogVisible = true
    },
    update() {
      this.dialogType = 'update'
      this.dialogTitle = '编辑用户'
      this.editDialogDisabled = false
      if (this.selectedRow.length !== 1) {
        this.$message.error('请选择一行数据')
        return
      }
      this.userInfo = this.selectedRow[0]
      this.editDialogVisible = true
    },
    confirmEdit() {
      this.editDialogVisible = false
      let editData = {}
      if (this.dialogType === 'add') {
        editData = this.userInfo
      } else if (this.dialogType === 'update') {editData = {id: this.selectedRow.id, ...this.userInfo}}
      console.log('editData')
      console.log(editData)
      if (this.dialogType !== 'view') {
        this.axios.post(this.prefixAddr + '/user/save', {...editData})
            .then(res => {
              if (res.data.code.toString() === '200') {
                this.$message.success('保存成功')
                this.getPages()
              } else this.$message.error(res.data.msg)
            })
            .catch()
      }
    },
    view(row) {
      this.dialogType = 'view'
      this.dialogTitle = '查看用户信息'
      this.userInfo = row
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
      this.axios.post(this.prefixAddr + '/user/delete', {ids: this.deleteIds})
          .then(res => {
            if (res.data.code.toString() === '200') {
              this.$message.success('删除成功')
              this.getPages(this.page, this.pageSize)
            } else {this.$message.error(this.data.msg)}
            console.log(res)
          })
          .catch(error => {this.$message.error('删除失败' + error)})
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
      this.userInfo.departmentName = data.name
      this.userInfo.departmentId = data.id
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
      }

      .treeVisible {
        display: block;
      }
    }

  }
}

</style>