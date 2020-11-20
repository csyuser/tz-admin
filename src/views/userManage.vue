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
    <div class="buttons">
      <el-button type="primary" size="small" class="add"><i class="el-icon-plus icon"></i>新增</el-button>
      <el-button size="small" class="update"><i class="el-icon-edit icon"></i>编辑</el-button>
      <el-button size="small" class="delete"><i class="el-icon-delete icon"></i>删除</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" :header-cell-style="{background:'#fafafa',...$store.state.cellStyle}" :cell-style="$store.state.cellStyle" row-class-name="yyy">
      <el-table-column prop="date" label="日期" width="180">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="address" label="地址">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'userManage',
  data() {
    return {
      formInline: {
        user: '',
        region: ''
      },
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    }
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

  > .buttons {
    margin-bottom: 10px;
    .icon {
      margin-right: 1em;
    }
    .xxx{
      font-size: 12px;
    }
  }

}

</style>