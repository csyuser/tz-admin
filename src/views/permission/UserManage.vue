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
    <Table :colsHead="colsHead" :tableDatas="tableDatas">
      <el-button size="small" class="update" @click="relatedDepartment"><i class="el-icon-edit icon"></i>关联部门
      </el-button>
      <el-button size="small" class="update" @click="relatedPost"><i class="el-icon-edit icon"></i>关联岗位</el-button>
      <el-button size="small" class="update" @click="relatedGroup"><i class="el-icon-edit icon"></i>关联小组</el-button>
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
  </div>
</template>

<script>
import Table from '@/components/permission/Table'

export default {
  name: 'userManage',
  components: {Table},
  data() {
    return {
      colsHead: [{prop: 'name', label: '用户名'}, {prop: 'post', label: '岗位'}, {prop: 'gender', label: '性别'},
        {prop: 'phone', label: '电话'}, {prop: 'mail', label: '邮箱'}, {prop: 'type', label: '状态'}, {
          prop: 'date',
          label: '创建日期'
        }],
      tableDatas: {
        count: 30,
        tableData: [{
          id: 1,
          name: '王小虎',
          post: '前端开发',
          gender: '男',
          phone: '13425014531',
          mail: '13425014531@qq.com',
          type: true,
          date: '2016-05-02',
        }, {
          id: 2,
          name: '王小虎',
          post: '前端开发',
          gender: '男',
          phone: '13425014531',
          mail: '13425014531@qq.com',
          type: false,
          date: '2016-05-02',
        }, {
          id: 3,
          name: '王小虎',
          post: '前端开发',
          gender: '男',
          phone: '13425014531',
          mail: '13425014531@qq.com',
          type: true,
          date: '2016-05-02',
        }, {
          id: 4,
          name: '王小虎',
          post: '前端开发',
          gender: '男',
          phone: '13425014531',
          mail: '13425014531@qq.com',
          type: true,
          date: '2016-05-02',
        }],
      },
      checkedLabels: [],
      checkedOptions: [],
      currentPage: 1,
      total: 40,
      formInline: {
        user: '',
        region: ''
      },
      tableData: [],
      checkedProps: [],
      transformData:[],
      value: [],
      filterMethod(query, item) {
        return item.label.indexOf(query) > -1;
      },
      relatedTitle:'',
      relatedDialogVisible: false,
      departmentVal:[],
      postVal:[],
      transformType:'',
      groupVal:[],
    }
  },
  mounted() {
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    },
//关联部门，岗位，小组
    relatedDepartment() {
      this.transformType = 'department'
      this.value = this.departmentVal
      this.relatedTitle = '关联部门'
      this.relatedDialogVisible = true
      this.transformData =  [{label: '上海', key: 0},{label: '北京', key: 1}, {label: '广州', key: 2},
        {label: '深圳', key: 3}, {label: '南京', key: 4}, {label: '西安', key: 5}, {label: '成都', key: 6}]
    },
    relatedPost(){
      this.value = this.postVal
      this.transformType = 'post'
      this.relatedTitle = '关联岗位'
      this.relatedDialogVisible = true
      this.transformData =  [{label: '前端', key:'前端',},{label: '后端', key: '后端'}, {label: '测试', key: '测试'},
        {label: 'ui', key: 'ui'}]
    },
    relatedGroup(){
      this.value = this.groupVal
      this.transformType = 'group'
      this.relatedTitle = '关联小组'
      this.relatedDialogVisible = true
      this.transformData =  [{label: '小组1', key:'小组1',},{label: '小组2', key: '小组2'}, {label: '小组3', key: '小组3'},
        {label: '小组4', key: '小组4'}]
    },
    confirmTransform(){
      this.relatedDialogVisible = false
      if (this.transformType === 'department'){
        this.departmentVal = this.value
      }else if (this.transformType === 'post'){
        this.postVal= this.value
      }else if(this.transformType === 'group'){
        this.groupVal= this.value
      }
      console.log(this.value)
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