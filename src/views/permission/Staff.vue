<template>
  <div class="staff-wrap">
    <el-form :inline="true" :model="searchData" class="demo-form-inline searchForm">
      <el-form-item>
        <el-input v-model="searchData.name" placeholder="输入名称" size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" size="small">查询</el-button>
      </el-form-item>
    </el-form>
    <Table class="table" :colsHead="colsHead" :tableDatas="tableDatas" :pageSize="pageSize" :page="page" :is-card="isCard"
           @currentChange="currentChange" @add="add" @update="update" @postSelect="selectRow" @delete="deleteRows"
           @dblclick="view">
      <span class="showCard">
        <span>卡片显示</span>
        <el-switch v-model="isCard"></el-switch>
      </span>
    </Table>
    <Card v-if="isCard" :title-list="cardListHead" :card-list="tableDatas.data" input-width="middle" @update:cardCheck="cardCheck" @dblclickCard="cardView"></Card>
    <el-dialog :title="dialogTitle" :visible.sync="editDialogVisible" width="1000px" :before-close="handleClose" @closed="closedDialog">
      <el-form label-position="right" label-width="95px" :inline="true" :model="editFormInfo" size="small"
               class="addForm"
               :disabled="editDialogDisabled" :rules="rules" ref="editDialog">
        <el-form-item label="头像" class="avatar">
          <AvatarUploader @update:img="updateImg" :img-path="editFormInfo['photoPath']"></AvatarUploader>
        </el-form-item>
        <el-form-item label="人员名称" prop="name">
          <el-input v-model="editFormInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="人员编码" prop="code">
          <el-input v-model="editFormInfo.code" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="职务" prop="post">
          <el-select v-model="editFormInfo.post">
            <el-option :label="item['dropName']" :value="item['id']" v-for="item in postDrop"
                       :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职级" prop="rank">
          <el-select v-model="editFormInfo['rank']">
            <el-option :label="item['dropName']" :value="item['id']" v-for="item in rankDrop"
                       :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="editFormInfo['sex']">
            <el-option label="女" value="0"></el-option>
            <el-option label="男" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门" prop="departmentId" style="height: 32px" class="SelectTree-item">
          <SelectTree v-model="editFormInfo.departmentId" :options="treeData" :props="defaultProps" :disabled="editDialogDisabled"/>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="editFormInfo.phone" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="联系邮箱" prop="email">
          <el-input v-model="editFormInfo.email" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码" prop="idCard">
          <el-input v-model="editFormInfo['idCard']" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="entryTime">
          <el-date-picker v-model="editFormInfo['entryTime']" value-format="yyyy-MM-dd" placeholder="选择日期"
                          style="width: 215px"></el-date-picker>
        </el-form-item>
        <el-form-item label="离职时间">
          <el-date-picker v-model="editFormInfo['departureTime']" value-format="yyyy-MM-dd" placeholder="选择日期"
                          style="width: 215px"></el-date-picker>
        </el-form-item>
      </el-form>
      <IconListDialog :type="dialogType" title-type="角色" v-if="dialogType !== 'add'"
                      :iconDataList="editFormInfo['userList']" :need-btn="false"></IconListDialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="confirmEdit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除人员" :visible.sync="deleteDialogVisible" width="650px" :before-close="handleClose">
      <DeleteRow @cancel="deleteDialogVisible = false" @confirm="confirmDelete"></DeleteRow>
    </el-dialog>
  </div>
</template>

<script>
import Table from '@/components/Table'
import DeleteRow from '@/components/permission/DeleteRow'
import SelectTree from '@/components/permission/SelectTree'
import AvatarUploader from '@/components/permission/AvatarUploader'
import Card from '@/components/permission/Card'
import IconListDialog from '@/components/permission/dialog/IconListDialog'
import {mixins} from '@/mixins/mixins'

export default {
  name: 'Staff',
  components: {Table, DeleteRow, SelectTree, AvatarUploader, Card,IconListDialog},
  mixins: [mixins],
  data() {
    return {
      colsHead: [{prop: 'name', label: '人员名称'}, {prop: 'code', label: '员工编码'}, {prop: 'postName', label: '职务'},
        {prop: 'rankName', label: '职级'}, {prop: 'sex', label: '性别'}, {prop: 'departmentName', label: '部门名称'},
        {prop: 'phone', label: '电话'}, {prop: 'email', label: '电子邮箱'}, {prop: 'idCard', label: '身份证号'},
        {prop: 'entryTime', label: '入职时间'}, {prop: 'departureTime', label: '离职时间'}],
      userInfo: {},
      isCard: false,
      imgId: '',
      cardCheckList:[],
      cardListHead: [{prop: 'name', label: '人员名称'},{prop: 'departmentName', label: '部门名称'}, {prop: 'phone', label: '联系电话'}, {prop: 'email', label: '电子邮箱'}]
    }
  },
  mounted() {
    this.getPages('/person/page')
    this.getDepartmentTree('/department/selectDepartmentTree')
    this.getDropList('3')
    this.getDropList('7')
  },
  methods: {
    currentChange(val, row) {
      this.currentPageChange(val, row, '/person/page')
    },
//表格增删改查
    selectRow(val) {
      this.selectedRows(val)
    },
    search() {
      this.searchRow('/person/page')
    },
    add() {
      this.dialogTitle = '新增人员'
      this.addRow()
    },
    update() {
      this.dialogTitle = '编辑人员'
      this.updateRow2("personId",'/person/selectPersonById')
    },
    confirmEdit() {
      this.confirmEditRow('/person/save', '/person/page')
    },
    view(row) {
      this.dialogTitle = '查看人员信息'
      this.viewRow2(row,'personId','/person/selectPersonById')
    },
    cardView(id){
      this.dialogTitle = '查看人员信息'
      this.viewRow('',id)
    },
    deleteRows() {
      this.deleteRow()
    },
    confirmDelete() {
      this.confirmDeleteRow('/person/delete', '/person/page')
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
.staff-wrap {
  padding: 20px;
  height: calc(100% - 60px);
  overflow: auto;
  > .searchForm {
    position: relative;

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

  .userInfo {
    border-top: 1px solid #ebebeb;
    padding: 15px 0;

    > h3 {
      font-weight: bold;
      margin-bottom: 10px;
    }
  }

}
</style>