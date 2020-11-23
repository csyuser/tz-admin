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
      <el-popover placement="bottom" trigger="click" class="popover-button">
        <el-checkbox-group v-model="checkedLabels" :style="{display:'flex','flex-direction':'column'}">
          <el-checkbox v-for="option in checkedOptions" :label="option" :key="option">{{ option}}</el-checkbox>
        </el-checkbox-group>
        <el-button size="small" icon="el-icon-s-grid" class="checkbox-button" slot="reference"></el-button>
      </el-popover>
    </div>
    <div class="table-wrap">
      <el-table :data="tableData" style="width: 100%" ref="multipleTable"
                :header-cell-style="{background:'#fafafa',...$store.state.cellStyle}"
                :cell-style="$store.state.cellStyle"  @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column :label="col.label" show-overflow-tooltip v-for="col in cols" :key="col.prop">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.type" active-color="#409eff" inactive-color="#ff4949" v-if="col.prop === 'type'"
                       @click.native="changeType(scope.row)">
            </el-switch>
            <span v-else>{{scope.row[col.prop]}} </span>
          </template>
        </el-table-column>
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
                     layout="total, prev, pager, next"
                     :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
const cols = [{prop: 'name', label: '用户名'}, {prop: 'post', label: '岗位'}, {prop: 'gender', label: '性别'},
  {prop: 'phone', label: '电话'}, {prop: 'mail', label: '邮箱'}, {prop: 'type', label: '状态'}, {prop: 'date', label: '创建日期'}]
export default {
  name: 'userManage',
  data() {
    return {
      checkedLabels: [],
      checkedOptions: [],
      currentPage: 1,
      total: 40,
      formInline: {
        user: '',
        region: ''
      },
      tableData: [],
      cols: cols,
      checkedProps:[]
    }
  },
  mounted() {
    this.cols.forEach(col=>{
      this.checkedProps.push(col.prop)
      this.checkedOptions.push(col.label)
      this.checkedLabels.push(col.label)
    })
    const tableDatas = {
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
      }, {
        id: 4,
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
      }, {
        id: 4,
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
      }, {
        id: 4,
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
    }
    this.tableData = tableDatas.tableData
    this.total = tableDatas.count
  },
  watch:{
//表头复选框控制表格的列
    checkedLabels:function(newVal){
      this.cols = []
      newVal.forEach(val=>{
        for (let i = 0;i<this.checkedOptions.length;i++){
          if (val ===this.checkedOptions[i]){
            this.cols.push({'prop':this.checkedProps[i],'label':val})
          }
        }
      })
    }
},
  methods: {
    onSubmit() {
      console.log('submit!')
    },
    handleClick(row) {
      console.log(row)
      this.$refs.multipleTable.clearSelection()
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
//切换type时对话框确认
    changeType(row) {
      this.$confirm(`此操作将${!row ? '开启' : '关闭'}验证, 是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.tableData.forEach(data => {
          if (data.id === row.id) {data.type = row.type}
        })
      }).catch(() => {
        this.tableData.forEach(data => {
          if (data.id === row.id) {data.type = !row.type}
        })
        this.$message('取消操作')
      })
    },
    handleSelectionChange(val){
      console.log(val)
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
    position: relative;

    .icon {
      margin-right: 1em;
    }

    > .popover-button {
      position: absolute;
      right: 0;
    }
  }

  > .table-wrap {
    > .pagination {
      margin-top: 8px;
    }
  }

  .xxx {

  }

}

</style>