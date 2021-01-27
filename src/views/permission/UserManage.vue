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
      <span class="showCard">
        <span>卡片显示</span>
        <el-switch v-model="isCard"></el-switch>
      </span>
    </Table>
    <Card v-if="isCard" :title-list="cardListHead" :card-list="tableDatas.data" :is-card="isCard" input-width="small"
          @update:cardCheck="cardCheck" @dblclickCard="cardView"></Card>
    <el-dialog :title="dialogTitle" :visible.sync="editDialogVisible" width="970px" :before-close="handleClose" @closed="closedDialog">
      <el-form label-position="right" label-width="85px" :inline="true" :model="editFormInfo" size="small"
               class="addForm" :disabled="editDialogDisabled" :rules="rules" ref="editDialog">
        <el-form-item label="人员头像" class="avatar">
          <el-avatar :src="staffInfo.photoPath" shape="square"></el-avatar>
        </el-form-item>
        <el-form-item label="人员名称" prop="code">
          <el-select v-model="editFormInfo.code" @change="staffNameChange" :disabled="dialogType !== 'add'">
          <el-option :label="code.name" :value="code.code" v-for="code in userCodes" :key="code.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人员编号" prop="code">
            <el-input v-model="editFormInfo.code" suffix-icon="xxx" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色密码" prop="password">
          <el-input v-model="editFormInfo.password" show-password suffix-icon="xxx" auto-complete="new-password"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="editFormInfo.name" suffix-icon="xxx"></el-input>
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
        <el-form-item label="所属部门" prop="departmentId" style="height: 32px" class="SelectTree-item">
          <SelectTree v-model="editFormInfo.departmentId" :options="treeData" :props="defaultProps" :disabled="editDialogDisabled"></SelectTree>
        </el-form-item>
        <el-form-item label="角色说明" class="texArea">
          <el-input v-model="editFormInfo['remark']" type="textarea" :autosize="{ minRows: 4, maxRows: 4}"></el-input>
        </el-form-item>
      </el-form>
      <IconListDialog :type="dialogType" title-type="岗位" @update:relate="relatedPost" v-if="dialogType !== 'add'"
                  :role-no-admin-list="editFormInfo.roleNoAdminList"
                  :role-admin-list="editFormInfo.roleAdminList"></IconListDialog>
     <AuthorityListDialog :table-datas1="permissionList" v-if="dialogType!=='add'" :user-id="userId" :type="dialogType"
                          @update:dialogInfo="updateDialogInfo"></AuthorityListDialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="confirmEdit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="relatedTitle" :visible.sync="relatedDialogVisible" append-to-body width="700px" :before-close="handleClose">
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
    <el-dialog title="删除角色" :visible.sync="deleteDialogVisible" width="650px" :before-close="handleClose">
      <DeleteRow @cancel="deleteDialogVisible = false" @confirm="confirmDelete"></DeleteRow>
    </el-dialog>
  </div>
</template>

<script>
import Table from '@/components/Table'
import DeleteRow from '@/components/permission/DeleteRow'
import SelectTree from '@/components/permission/SelectTree'
import Card from '@/components/permission/Card'
import AuthorityListDialog from '@/components/permission/dialog/AuthorityListDialog'
import IconListDialog from '@/components/permission/dialog/IconListDialog'
import {mixins} from '@/mixins/mixins'

export default {
  name: 'userManage',
  components: {Table, DeleteRow,SelectTree,Card,AuthorityListDialog,IconListDialog},
  mixins:[mixins],
  data() {
    return {
      colsHead: [{prop: 'roleName', label: '角色名'}, {prop: 'code', label: '编号'}, {prop: 'departmentName', label: '部门'},
        {prop: 'riskLevel', label: '风险等级'}, {prop: 'status', label: '角色状态'}],
      userCodes: [],
      staffInfo:{},
      isCard: false,
      cardCheckList:[],
      cardListHead: [{prop: 'name', label: '角色名称'},{prop: 'departmentName', label: '部门名称'}, {prop: 'status', label: '角色状态'},],
      permissionList:[],
      userId:'',
      prePwd:''
    }
  },
  watch:{
    isCard(){
      this.cardCheckList = []
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
      this.userId = this.getRowId()
      this.getUserInfo(this.userId)
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
//关联岗位
    relatedPost() {
      this.relatedName = 'post'
      this.related('/user/selectUserAndRole','关联岗位', {userId: this.userId})
    },
    confirmTransform() {this.confirmRelate('/role/saveUserRole', {
      type: '0',
      userIds: [this.userId],
      roleIds: this.relatedValue
    },{userId:this.userId},'/user/selectUserInfo')
    },
//获取用户详情
    getUserInfo(id){
      this.getDialogInfo({userId: id},'/user/selectUserInfo',)
    },
    staffNameChange(val){
      this.axios.get('person/selectPersonOne',{
        params:{code:val}
      }).then((res)=>{
        if (res.data.code.toString() === '200'){
          this.staffInfo = res.data.data
          this.$set(this.editFormInfo, 'password',  res.data.data['userPwd'])
          this.prePwd = res.data.data['userPwd']
        }
      })
      .catch()
    },
    updateDialogInfo(){
      this.getUserInfo(this.userId)
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
    > .texArea{
      display: block;
      &::v-deep{
        margin-bottom: 0;
        .el-form-item__content{
          width: calc(100% - 85px);
        }
      }
    }
    > .SelectTree-item::v-deep{
      .el-form-item__content{
        height: 32px;
      }
    }
    > .avatar {
      width: 100%;
      display: flex;
      align-items: center;
    }
  }
}

</style>