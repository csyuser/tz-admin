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
    <div class="table-wrap">
      <el-table :data="tableData" style="width: 100%"  ref="multipleTable"
                :header-cell-style="{background:'#fafafa',...$store.state.cellStyle}"
                :cell-style="$store.state.cellStyle">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="name" label="用户名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="post" label="岗位" show-overflow-tooltip></el-table-column>
        <el-table-column prop="gender" label="性别" show-overflow-tooltip></el-table-column>
        <el-table-column prop="phone" label="电话" show-overflow-tooltip></el-table-column>
        <el-table-column prop="mail" label="邮箱" show-overflow-tooltip></el-table-column>
        <el-table-column label="状态" show-overflow-tooltip>
          <template slot-scope="scope">
          <el-switch v-model="scope.row.type" active-color="#409eff" inactive-color="#ff4949" @click.native="changeType(scope.row)">
          </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="创建日期" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="[10, 20, 30, 40]"
                     :page-size="10"
                     layout="total, sizes, prev, pager, next"
                     :total="totalPage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'userManage',
  data() {
    return {
      currentPage: 4,
      totalPage: 40,
      formInline: {
        user: '',
        region: ''
      },
      tableData: [{
        id:1,
        name: '王小虎',
        post:'前端开发',
        gender:'男',
        phone:'13425014531',
        mail:'13425014531@qq.com',
        type:true,
        date: '2016-05-02',
      }, {
        id:2,
        name: '王小虎',
        post:'前端开发',
        gender:'男',
        phone:'13425014531',
        mail:'13425014531@qq.com',
        type:false,
        date: '2016-05-02',
      }, {
        id:3,
        name: '王小虎',
        post:'前端开发',
        gender:'男',
        phone:'13425014531',
        mail:'13425014531@qq.com',
        type:true,
        date: '2016-05-02',
      }, {
        id:4,
        name: '王小虎',
        post:'前端开发',
        gender:'男',
        phone:'13425014531',
        mail:'13425014531@qq.com',
        type:true,
        date: '2016-05-02',
      }]
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    },
    handleClick(row) {
      console.log(row)
      this.$refs.multipleTable.clearSelection();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    changeType(row){
      this.$confirm(`此操作将${!row ? '开启' : '关闭'}验证, 是否继续？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        this.tableData.forEach(data=>{
          if (data.id === row.id){data.type = row.type}
        })
      }).catch(() => {
        this.tableData.forEach(data=>{
          if (data.id === row.id){data.type = !row.type}
        })
        this.$message('取消操作')
      })

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

  > .buttons {
    margin-bottom: 10px;

    .icon {
      margin-right: 1em;
    }

    .xxx {
      font-size: 12px;
    }
  }

  > .table-wrap {
    > .pagination {
      margin-top: 8px;
    }
  }

}

</style>