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
      <el-button size="small" class="update"><i class="el-icon-edit icon"></i>关联部门</el-button>
      <el-button size="small" class="update"><i class="el-icon-edit icon"></i>关联岗位</el-button>
      <el-button size="small" class="update"><i class="el-icon-edit icon"></i>关联小组</el-button>
    </Table>
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
        {prop: 'phone', label: '电话'}, {prop: 'mail', label: '邮箱'}, {prop: 'type', label: '状态'}, {prop: 'date', label: '创建日期'}],
      tableDatas : {
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
      checkedProps:[]
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    },
  }
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