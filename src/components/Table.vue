<template>
  <div class="table-wrap">
    <div class="buttons">
      <el-button type="primary" size="small" class="add" @click="$emit('add',$event)"><i class="el-icon-plus icon"></i>新增
      </el-button>
      <el-button size="small" class="update" @click="$emit('update',$event)"><i class="el-icon-edit icon"></i>编辑</el-button>
      <el-button size="small" class="delete" @click="$emit('delete',$event)"><i class="el-icon-delete icon"></i>删除</el-button>
      <el-popover placement="bottom" trigger="click" class="popover-button">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="checkedLabels" :style="{display:'flex','flex-direction':'column'}"
                           @change="handleCheckedChange">
          <el-checkbox v-for="option in checkedOptions" :label="option" :key="option">{{ option }}</el-checkbox>
        </el-checkbox-group>
        <el-button size="small" icon="el-icon-s-grid" class="checkbox-button" slot="reference"></el-button>
      </el-popover>
    </div>
        <div class="table-wrap">
          <el-table :data="tableData" style="width: 100%" ref="multipleTable" row-key="id"
                    :header-cell-style="{background:'#fafafa',...$store.state.cellStyle}"
                    :cell-style="$store.state.cellStyle" @select="selectRow" @row-dblclick="dblclick"
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column :label="col.label" show-overflow-tooltip v-for="col in cols" :key="col.prop">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.type" active-color="#409eff" inactive-color="#ff4949"
                           v-if="col.prop === 'type'"
                           @click.native="changeType(scope.row)">
                </el-switch>
                <span v-else>{{ scope.row[col.prop] }} </span>
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
export default {
  name: 'Table',
  props: {
    colsHead: {type: Array},
    tableDatas: {type: Object},
  },
  data() {
    return {
      checkAll: true,
      isIndeterminate: false,
      checkedLabels: [],
      checkedOptions: [],
      checkedProps: [],
      currentPage: 1,
      total: 40,
      tableData: [],
      cols: [],
      selectedRow:[],
      xxx: [{
        id: 1,
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        id: 2,
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        id: 3,
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        children: [{
          id: 31,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          id: 32,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }]
      }, {
        id: 4,
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  mounted() {
    this.cols = this.colsHead
    this.cols.forEach(col => {
      this.checkedProps.push(col.prop)
      this.checkedOptions.push(col.label)
      this.checkedLabels.push(col.label)
    })
    this.tableData = this.tableDatas.tableData
    this.total = this.tableDatas.count
  },
  watch: {
//表头复选框控制表格的列
    checkedLabels: function (newVal) {
      this.cols = []
      const result = []
      newVal.forEach(val => {
        for (let i = 0; i < this.checkedOptions.length; i++) {
          if (val === this.checkedOptions[i]) {
            result.push({'order': i, 'prop': this.checkedProps[i], 'label': val})
          }
        }
      })
      this.cols = result.sort((a, b) => a.order - b.order)
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    handleCheckAllChange(val) {
      this.checkedLabels = val ? this.checkedOptions : []
      this.isIndeterminate = false
    },
    handleCheckedChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.checkedOptions.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkedOptions.length
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
    //选中父元素，全选子元素
    selectRow(val) {
      console.log('选择')
      this.$emit('postSelect',val)
      let xxx = []
      val.forEach(item=>{
        xxx.push(item)
        if (item.children){
          item.children.forEach(child=>{
            console.log(child)
          })
        }
      })
      xxx.forEach(item=>{
        this.$refs.multipleTable.toggleRowSelection(item,true);
      })
    },
    dblclick(row){
      this.$emit('dblclick',row)
    }
  }
}
</script>

<style scoped lang='scss'>
.table-wrap {
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
}
</style>