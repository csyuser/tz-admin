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
           @currentChange="currentChange" class="table" :is-card="isCard"
           @add="add" @update="update" @postSelect="selectRow" @delete="deleteRows" @dblclick="view">
      <el-button size="small" class="update" @click="relatedPost">
        <SvgIcon icon-name="post"></SvgIcon>
        关联岗位
      </el-button>
      <el-button size="small" class="update" @click="relatedGroup">
        <SvgIcon icon-name="group"></SvgIcon>
        关联小组
      </el-button>
      <span class="showCard">
        <span>卡片显示</span>
        <el-switch v-model="isCard"></el-switch>
      </span>
    </Table>
    <Card v-if="isCard" :title-list="cardListHead" :card-list="tableDatas.data" input-width="small" @update:cardCheck="cardCheck" @dblclickCard="cardView"></Card>
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
    <el-dialog :title="dialogTitle" :visible.sync="editDialogVisible" :width="dialogType==='add'?'660px':'970px'">
      <el-form label-position="right" label-width="85px" :inline="true" :model="editFormInfo" size="small"
               class="addForm" :disabled="editDialogDisabled" :rules="rules" ref="editDialog">
        <el-form-item label="人员头像" class="avatar">
          <el-avatar :src="staffInfo.photoPath" shape="square"></el-avatar>
        </el-form-item>
        <el-form-item label="人员名称" prop="name">
          <el-select v-model="editFormInfo.code">
          <el-option :label="code.code" :value="code.code" v-for="code in userCodes" :key="code.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人员编号" prop="code">
<!--          <el-select v-model="editFormInfo.code">-->
            <el-input v-model="editFormInfo.code" suffix-icon="xxx" disabled></el-input>
<!--            <el-option :label="code.code" :value="code.code" v-for="code in userCodes" :key="code.id"></el-option>-->
<!--          </el-select>-->
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="editFormInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="角色密码" prop="password">
            <el-input v-model="editFormInfo.password" show-password suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="风险等级">
          <el-select v-model="editFormInfo.riskLevel">
            <el-option label="异地登录" value="1"></el-option>
            <el-option label="频繁登录" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色状态" prop="status">
          <el-select v-model="editFormInfo.status">
            <el-option label="正常" value="1"></el-option>
            <el-option label="锁定" value="2"></el-option>
            <el-option label="注销" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门" prop="departmentId" style="height: 32px">
          <SelectTree v-model="editFormInfo.departmentId" :options="treeData" :props="defaultProps" :disabled="editDialogDisabled"></SelectTree>
        </el-form-item>
      </el-form>
<!--      <StaffDialog :staffFormInfo ="staffInfo" :postDrop="postDrop" :rankDrop="rankDrop" :treeData="treeData" v-if="dialogType!=='add'"></StaffDialog>-->
     <AuthorityListDialog :table-datas1="permissionList" v-if="dialogType!=='add'"></AuthorityListDialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="confirmEdit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除角色" :visible.sync="deleteDialogVisible" width="650px">
      <DeleteRow @cancel="deleteDialogVisible = false" @confirm="confirmDelete"></DeleteRow>
    </el-dialog>
  </div>
</template>

<script>
import Table from '@/components/permission/Table'
import SvgIcon from '@/components/SvgIcon'
import DeleteRow from '@/components/permission/DeleteRow'
import SelectTree from '@/components/permission/SelectTree'
import AuthorityListDialog from '@/components/permission/dialog/AuthorityListDialog'
import Card from '@/components/permission/Card'
import {mixins} from '@/mixins/mixins'

export default {
  name: 'userManage',
  components: {Table, SvgIcon, DeleteRow,SelectTree,AuthorityListDialog,Card},
  mixins:[mixins],
  data() {
    return {
      colsHead: [{prop: 'name', label: '角色名'}, {prop: 'code', label: '编号'}, {prop: 'departmentName', label: '部门'},
        {prop: 'riskLevel', label: '风险等级'}, {prop: 'status', label: '角色状态'}],
      userCodes: [],
      staffInfo:{},
      isCard: false,
      cardCheckList:[],
      cardListHead: [{prop: 'name', label: '角色名称'},{prop: 'departmentName', label: '部门名称'}, {prop: 'status', label: '角色状态'},],
      permissionList:[],
    }
  },
  mounted() {
    this.getPages('/user/page')
    this.getDepartmentTree('/department/selectDepartmentTree')
    this.getDropList('3')
    this.getDropList('7')
    this.axios.get('/dropList/selectPerson')
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
      this.dialogTitle = '新增角色'
      this.addRow()
    },
    update() {
      this.dialogTitle = '编辑角色'
      this.dialogType = 'update'
      this.editDialogDisabled = false
      let id = this.getUserId()
      this.getUserInfo(id)
    },
    confirmEdit() {
      this.confirmEditRow('/user/save', '/user/page')
    },
    view(row) {
      this.dialogTitle = '查看角色信息'
      this.dialogType = 'view'
      this.editDialogVisible = true
      this.editDialogDisabled = true
      let id = this.isCard?this.cardCheckList[0]:row.id
      this.getUserInfo(id)
    },
    cardView(id){
      this.dialogTitle = '查看人员信息'
      this.dialogType = 'view'
      this.editDialogVisible = true
      this.editDialogDisabled = true
      this.getUserInfo(id)
    },
    deleteRows() {
      this.deleteRow()
    },
    confirmDelete() {
      this.confirmDeleteRow('/user/delete', '/user/page')
    },
//获取用户详情
    getUserInfo(id){
      this.staffInfo = {}
      this.permissionList = []
      this.axios.get('/user/selectUserInfo', {
        params: {userId:id}
      }).then(res => {
        if (res.data.code.toString() === '200') {
          this.editFormInfo = res.data.data
          this.staffInfo = res.data.data['person']
          this.permissionList = res.data.data['permissionList']
        } else {
          this.$message.error(res.data.msg)
        }
      })
          .catch()
    },
    getUserId(){
      let id
      if (this.isCard && this.cardCheckList.length === 1){
        id = this.cardCheckList[0]
        this.editDialogVisible = true
      }else if (!this.isCard && this.selectedRow.length === 1){
        this.editDialogVisible = true
        id = this.selectedRow[0].id
      }else {this.$message.error('请选择一行数据')}
      return id
    },
    //获取子组件的数据
    updateImg(value) {
      this.imgId = value
    },
    cardCheck(val){
      this.cardCheckList = val
    }
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
  > .table {
    .showCard {
      margin-left: 10px;

      > span {
        margin-right: 0.5em
      }
    }
  }

  .addForm {
    margin-top: -15px;
    > .el-form-item {
      margin-bottom: 18px;
    }
    > .avatar {
      width: 100%;
      display: flex;
      align-items: center;
    }
  }
}

</style>