<template>
  <div class="user-manage-wrap">
    <el-form :inline="true" :model="formInline" class="demo-form-inline searchForm">
      <el-form-item>
        <el-input v-model="formInline.user" placeholder="输入名称或邮箱搜索" size="small"></el-input>
      </el-form-item>
      <el-form-item class="selectInput">
        <el-select v-model="formInline.region" placeholder="状态" size="small">
          <el-option label="激活" value="active"></el-option>
          <el-option label="失效" value="disabled"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" size="small">查询</el-button>
      </el-form-item>
    </el-form>
    <Table :colsHead="colsHead" :tableDatas="tableDatas" @add="add" @update="update"
           @postSelect="selectRow" @delete="deleteRows" @dblclick="view">
      <el-button size="small" class="update" @click="relatedDepartment">
        <SvgIcon icon-name="department"></SvgIcon>
        关联部门
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
    <el-dialog :title="editDialogName" :visible.sync="editDialogVisible" width="660px">
      <el-form label-position="right" label-width="85px" :inline="true" :model="userInfo" size="small"
               class="addForm"
               :disabled="editDialogDisabled">
        <el-form-item label="用户名称">
          <el-input v-model="userInfo.name" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="用户编号">
          <el-input v-model="userInfo.code" suffix-icon="xxx"></el-input>
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
        <SelectTree :treeValue = userInfo.department labelName="部门" :data="treeData" :defaultProps="{children: 'children',label: 'label'}"
        @selectedTree="selectedTree">
        </SelectTree>
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
import Qs from 'qs'
import Table from '@/components/permission/Table'
import SvgIcon from '@/components/SvgIcon'
import DeleteRow from '@/components/permission/DeleteRow'
import SelectTree from '@/views/permission/SelectTree'

export default {
  name: 'userManage',
  components: {Table, SvgIcon,DeleteRow,SelectTree},
  data() {
    return {
      colsHead: [{prop: 'name', label: '用户名'}, {prop: 'code', label: '编号'},{prop: 'department', label: '部门'}, {prop: 'riskLevel', label: '风险等级'},
        {prop: 'status', label: '用户状态'}],
      tableDatas: {
        count: 30,
        tableData: [{
          id: 1,
          name: '王小虎',
          code: '1',
          riskLevel: '1',
          status: '1',
          department:'开发部'
        }, {
          id: 2,
          name: '王小虎',
          code: '2',
          riskLevel: '1',
          status: '2',
          department:'运营部'
        }, {
          id: 3,
          name: '王小虎',
          code: '3',
          riskLevel: '1',
          status: '2',
          department:'人事部'
        }, {
          id: 4,
          name: '王小虎',
          code: '3',
          riskLevel: '1',
          status: '3',
          department:'开发部'
        }],
      },
      checkedLabels: [],
      checkedOptions: [],
      page: 1,
      pageSize: 10,
      formInline: {
        user: '',
        region: ''
      },
      tableData: [],
      checkedProps: [],
      transformData: [],
      value: [],
      filterMethod(query, item) {
        return item.label.indexOf(query) > -1
      },
      relatedTitle: '',
      relatedDialogVisible: false,
      departmentVal: [],
      postVal: [],
      transformType: '',
      groupVal: [],
      editDialogVisible: false,
      deleteDialogVisible: false,
      editDialogDisabled: false,
      userInfo: {
        name:'',code:'',riskLevel:'',status:'',department:''
      },
      editDialogName: '',
      selectedRow: [],
      treeData: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
    }
  },
  mounted() {
    this.axios.get(this.prefixAddr + '/user/page', {
      // params: {page:this.page, pageSize:this.pageSize},
    }).then(res => {
      console.log(res)
    })
        .catch()
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    },
//关联部门，岗位，小组
    relatedDepartment() {
      if (this.selectedRow.length !== 1) {this.$message.error('请选择一行数据');return}
      this.transformType = 'department'
      this.value = this.departmentVal
      this.relatedTitle = '关联部门'
      this.relatedDialogVisible = true
      this.transformData = [{label: '上海', key: 0}, {label: '北京', key: 1}, {label: '广州', key: 2},
        {label: '深圳', key: 3}, {label: '南京', key: 4}, {label: '西安', key: 5}, {label: '成都', key: 6}]
    },
    relatedPost() {
      if (this.selectedRow.length !== 1) {this.$message.error('请选择一行数据');return}
      this.value = this.postVal
      this.transformType = 'post'
      this.relatedTitle = '关联岗位'
      this.relatedDialogVisible = true
      this.transformData = [{label: '前端', key: '前端',}, {label: '后端', key: '后端'}, {label: '测试', key: '测试'},
        {label: 'ui', key: 'ui'}]
    },
    relatedGroup() {
      if (this.selectedRow.length !== 1) {this.$message.error('请选择一行数据');return}
      this.value = this.groupVal
      this.transformType = 'group'
      this.relatedTitle = '关联小组'
      this.relatedDialogVisible = true
      this.transformData = [{label: '小组1', key: '小组1',}, {label: '小组2', key: '小组2'}, {label: '小组3', key: '小组3'},
        {label: '小组4', key: '小组4'}]
    },
    confirmTransform() {
      this.relatedDialogVisible = false
      if (this.transformType === 'department') {
        this.departmentVal = this.value
      } else if (this.transformType === 'post') {
        this.postVal = this.value
      } else if (this.transformType === 'group') {
        this.groupVal = this.value
      }
    },
//用户的增删改查
    selectRow(val) {
      this.selectedRow = []
      val.forEach(item => {
        this.selectedRow.push(item)
      })
    },
    add() {
      this.editDialogName = '增加用户'
      this.userInfo = {}
      this.editDialogDisabled = false
      this.editDialogVisible = true
    },
    update() {
      this.editDialogName = '编辑用户'
      this.editDialogDisabled = false
      if (this.selectedRow.length !== 1) {this.$message.error('请选择一行数据');return}
      this.userInfo = this.selectedRow[0]
      this.editDialogVisible = true
    },
    confirmEdit() {
      this.editDialogVisible = false
      this.axios.post(this.prefixAddr + '/department/save',Qs.stringify({...this.departmentInfo}))
      .then(res=>{
        console.log(res)
      })
      .catch()
    },
    view(row) {
      this.userInfo = row
      this.editDialogVisible = true
      this.editDialogDisabled = true
    },
    deleteRows() {
      if (this.selectedRow.length > 0) {
        this.deleteDialogVisible = true
      } else {
        this.$message.error('请选择至少一行数据')
      }
    },
    confirmDelete() {
      this.deleteDialogVisible = false
    },
//输入框树形结构
    selectedTree(val){
      this.userInfo.department = val.label
      console.log('val.label')
      console.log(val.label)
      console.log(this.userInfo)
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

  //> .buttons {
  //  margin-bottom: 10px;
  //  position: relative;
  //
  //  .icon {
  //    margin-right: 1em;
  //  }
  //
  //  > .popover-button {
  //    position: absolute;
  //    right: 0;
  //  }
  //}
  //
  //> .table-wrap {
  //  > .pagination {
  //    margin-top: 8px;
  //  }
  //}
  //
  //.xxx {
  //
  //}

}

</style>