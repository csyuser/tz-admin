<template>
  <div class="table-wrap">
    <div class="buttons" v-if="needButton">
      <el-button type="primary" size="small" class="add" @click="$emit('add',$event)"><i class="el-icon-plus icon"></i>新增
      </el-button>
      <el-button size="small" class="update" @click="$emit('update',$event)"><i class="el-icon-edit icon"></i>编辑
      </el-button>
      <el-button size="small" class="delete" @click="$emit('delete',$event)"><i class="el-icon-delete icon"></i>删除
      </el-button>
      <slot></slot>
      <el-popover placement="bottom" trigger="click" class="popover-button" v-if="!isCard">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="checkedLabels" :style="{display:'flex','flex-direction':'column'}"
                           @change="handleCheckedChange">
          <el-checkbox v-for="option in checkedOptions" :label="option" :key="option">{{ option }}</el-checkbox>
        </el-checkbox-group>
        <el-button size="small" icon="el-icon-s-grid" class="checkbox-button" slot="reference"></el-button>
      </el-popover>
    </div>
    <div class="simple buttons">
      <slot name="simple"></slot>
    </div>
    <div class="table-wrap" v-if="!isCard">
      <el-table :data="tableData" style="width: 100%" ref="multipleTable" row-key="id" :select-on-indeterminate="false"
                max-height="645px"
                :header-cell-style="{background:'#fafafa',...$store.state.cellStyle}"
                :cell-style="$store.state.cellStyle" @select="selectRow" @row-dblclick="dblclick"
                @select-all="selectAllRows" @expand-change=expandChange
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column type="selection" width="55" v-if="needSelect" :selectable='selectTable'></el-table-column>
        <el-table-column :label="col.label" show-overflow-tooltip v-for="col in cols" :key="col.prop">
          <template slot-scope="scope">
            <!--            <el-switch v-model="scope.row.type" active-color="#409eff" inactive-color="#ff4949"-->
            <!--                       v-if="col.prop === 'type1'"-->
            <!--                       @click.native="changeType(scope.row)">-->
            <!--            </el-switch>-->
            <SvgIcon icon-name="administrator" v-if="col.prop === 'roleName'"
                     :color="scope.row['roleType'] === '0' ? '#ffb980':'#2ec7c9' "></SvgIcon>
            <span v-if="col.prop === 'riskLevel'">{{ riskLevel(scope.row[col.prop]) }} </span>
            <span v-else-if="col.prop === 'status'">{{ userStatus(scope.row[col.prop]) }} </span>
            <span v-else-if="col.prop === 'selection'">{{ selection(scope.row[col.prop]) }} </span>
            <span v-else-if="col.prop === 'sex'">{{ gender(scope.row[col.prop]) }} </span>
            <span v-else-if="col.prop === 'createTime'">{{ formatTime(scope.row[col.prop]) }} </span>
            <span v-else-if="col.prop === 'type'">{{ newsType(scope.row[col.prop]) }} </span>
            <span v-else-if="col.prop === 'roleType'">{{ roleType(scope.row[col.prop]) }} </span>
            <span v-else-if="col.prop === 'person'">{{ scope.row[col.prop].name }} </span>
            <span v-else-if="col.prop === 'menuType'">{{ menuType(scope.row[col.prop])}} </span>
            <span v-else>{{ scope.row[col.prop] }} </span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination" @current-change="handleCurrentChange" v-if="(tableName !== 'menu' && needPage)"
                     :current-page="page"
                     :page-sizes="[10, 20, 30, 40]"
                     :page-size="pageSize"
                     layout="total, prev, pager, next"
                     :total="total">
      </el-pagination>
    </div>
    <slot name="editDialog"></slot>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
import {helper} from '@/method'

export default {
  name: 'Table',
  components: {SvgIcon},
  props: {
    colsHead: {type: Array},
    tableDatas: {type: [Object, Array]},
    pageSize: {type: Number},
    page: {type: Number},
    tableName: {type: String},
    needButton: {
      type: Boolean,
      default: true
    },
    needSelect: {
      type: Boolean,
      default: true
    },
    needPage: {
      type: Boolean,
      default: true
    },
    isCard: {
      type: Boolean,
      default: false
    },
    allowSelect: {type: Boolean, default: true}
  },
  data() {
    return {
      checkAll: true,
      isIndeterminate: false,
      checkedLabels: [],
      checkedOptions: [],
      checkedProps: [],
      total: 0,
      tableData: [],
      cols: [],
      selectedRow: [],
      children: [],
      expand: [],
    }
  },
  mounted() {
    this.cols.forEach(col => {
      this.checkedProps.push(col.prop)
      this.checkedOptions.push(col.label)
      this.checkedLabels.push(col.label)
    })
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
    },
//监听表格数据传递
    tableDatas: {
      handler(newVal) {
        if (newVal && newVal.data) {
          this.tableData = newVal.data
          this.total = newVal.count
        } else if (newVal && newVal.length && newVal.length >= 1) {
          this.tableData = newVal
        } else {this.tableData = []}
        this.selectedRow = []
      },
      immediate: true,
      deep: true
    },
    colsHead: {
      handler(newVal) {
        this.cols = newVal
      },
      immediate: true,
      deep: true
    },
    isCard() {
      this.selectedRow = []
      this.$emit('postSelect', this.selectedRow)
    }
  },
  methods: {
    expandChange(row, type) {
      let isContains = false
      this.expand.forEach((item, index) => {
        if (item.rowId === row.id) {
          this.expand[index].type = type
          isContains = true
        }
      })
      if (isContains === false) {this.expand.push({rowId: row.id, type: type})}
    },
    handleCurrentChange(val) {
      this.$refs.multipleTable.clearSelection()
      this.selectedRow = []
      this.$emit('currentChange', val, this.selectedRow)
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
    selectTable(row) {
      // return this.allowSelect
      if(!this.allowSelect){
        if(row.children && row.children.length > 0 || !row.parentName || row.parentName === null){
          return true
        }else {return false}
      }else {
        return true
      }
    },

//选中父元素，全选子元素
    //如果点击行有子集((选中状态))
    checkedHasChild(row) {
      if (row.children) {
        let isExpand = false
        this.expand.forEach((item, index) => {
          if (item.rowId === row.id && this.expand[index].type === true) {isExpand = true}
        })
        if (this.expand.length > 0 && isExpand === true) {
          row.children.forEach(child => {
            if (this.selectedRow.indexOf(child) < 0) {
              this.selectedRow.push(child)
              this.children.push(child)
            }
          })
        }
      }
    },
    //如果点击行有父级(选中状态)
    checkedHasParent(row) {
      let parent = {}
      if (row['previousMenu'] && row['previousMenu'] !== '') {
        this.tableData.forEach(item => {
          if (item.name === row['previousMenu']) {
            parent = item
          }
        })
        let childSelected = true
        parent.children && parent.children.forEach(child => {
          if (this.selectedRow.indexOf(child) < 0) {childSelected = false}
        })
        if (childSelected === true) {this.selectedRow.push(parent)}
      }
    },
    //如果点击行包为选中状态
    inCheckedRow(row) {
      this.selectedRow.push(row)
      this.checkedHasChild(row)
      this.checkedHasParent(row)
    },
    //如果点击行有子级（非选中状态）
    uncheckedHasChild(row) {
      if (row.children) {
        row.children.forEach(child => {
          if (this.selectedRow.indexOf(child) >= 0) {
            let index = this.selectedRow.indexOf(child)
            this.selectedRow.splice(index, 1)
          }
        })
      }
    },
    //如果点击行有父级（非选中状态）
    uncheckedHasParent(row) {
      let parent = {}
      if (row['previousMenu'] && row['previousMenu'] !== '') {
        this.tableData.forEach(item => {
          if (item.name === row['previousMenu']) {
            parent = item
          }
        })
        if (this.selectedRow.indexOf(parent) >= 0) {
          let index = this.selectedRow.indexOf(parent)
          this.selectedRow.splice(index, 1)
        }
      }
    },
    //如果点击行为非选中状态
    inUncheckedRow(row) {
      let index = this.selectedRow.indexOf(row)
      this.selectedRow.splice(index, 1)
      this.uncheckedHasChild(row)
      this.uncheckedHasParent(row)
    },
    //切换表格的选中状态
    toggleChecked() {
      this.$refs.multipleTable.clearSelection()
      this.selectedRow.forEach(item => {
        this.$refs.multipleTable.toggleRowSelection(item, true)
      })
    },
    selectRow(val, row) {
      if (val.indexOf(row) >= 0) {
        this.inCheckedRow(row)
      } else {
        this.inUncheckedRow(row)
      }
      this.toggleChecked()
      this.$emit('postSelect', this.selectedRow)
    },
    //全选
    selectAllRows(selection) {
      if (this.children.length > 0) {
        this.children.forEach(child => {
          let index = selection.indexOf(child)
          selection.splice(index, 1)
        })
      }
      if (selection.length > 0) {
        this.children = []
        this.selectedRow = []
        selection.forEach(item => {
          this.selectedRow.push(item)
          if (item.children) {
            item.children.forEach(child => {
              if (this.selectedRow.indexOf(child) < 0) {
                this.selectedRow.push(child)
                this.children.push(child)
              }
            })
          }
        })
        this.$refs.multipleTable.clearSelection()
        this.selectedRow.forEach(item => {
          this.$refs.multipleTable.toggleRowSelection(item, true)
        })
      } else {
        this.children = []
        this.selectedRow = []
        this.$refs.multipleTable.clearSelection()
      }
      this.$emit('postSelect', this.selectedRow)
    },
    dblclick(row) {
      this.$emit('dblclick', row)
    },
    //用户风险等级判断，1异地登录2频繁登录
    riskLevel(level) {
      return helper.riskLevel(level)
    },
    //用户状态，用户状态1正常2锁定3注销
    userStatus(level) {
      return helper.userStatus(level)
    },
    //选用标志
    selection(val) {
      return helper.selection(val)
    },
    gender(val) {
      return helper.gender(val)
    },
    formatTime(val) {
      return helper.formatTime(val)
    },
    newsType(val) {
      return helper.newsType(val)
    },
    roleType(val) {
      return helper.roleType(val)
    },
    menuType(val){
      return helper.menuType(val)
    }
    //切换type时对话框确认
//     changeType(row) {
//       this.$confirm(`此操作将${!row ? '开启' : '关闭'}验证, 是否继续？`, '提示', {
//         confirmButtonText: '确定',
//         cancelButtonText: '取消',
//         type: 'warning'
//       }).then(async () => {
//         this.tableData.forEach(data => {
//           if (data.id === row.id) {data.type = row.type}
//         })
//       }).catch(() => {
//         this.tableData.forEach(data => {
//           if (data.id === row.id) {data.type = !row.type}
//         })
//         this.$message('取消操作')
//       })
//     },
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

}
</style>