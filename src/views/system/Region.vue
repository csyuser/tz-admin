<template>
  <div class="region-wrap">
    <el-form :inline="true" :model="searchData" class="demo-form-inline searchForm">
      <el-form-item>
        <el-select v-model="searchData['province']" filterable placeholder="选择省份" clearable size="small"
                   @change="provinceChange">
          <el-option :label="item['xzqhmc']" :value="item['xzqhszDm']" v-for="item in provinceList"
                     :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchData['city']" filterable placeholder="选择市级" clearable size="small"
                   :disabled="!searchData['province']">
          <el-option :label="item['xzqhmc']" :value="item['xzqhszDm']" v-for="item in cityList"
                     :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" size="small">查询</el-button>
      </el-form-item>
    </el-form>
    <Table :colsHead="colsHead" :tableDatas="tableDatas" :need-page="false" @add="add" @update="update"
           @delete="deleteRows"
           @dblclick="view" @postSelect="selectRow">
    </Table>
    <el-dialog :title="dialogTitle" :visible.sync="editDialogVisible" width="790px" :before-close="handleClose"
               @closed="closedDialog">
      <el-form label-position="right" label-width="148px" :inline="true" :model="editFormInfo" size="small"
               class="addForm" :disabled="editDialogDisabled" :rules="rules" ref="editDialog">
        <el-form-item label="行政区划名称" prop="xzqhmc">
          <el-input v-model="editFormInfo.xzqhmc" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="行政区划数字代码" prop="xzqhszDm">
          <el-input v-model="editFormInfo.xzqhszDm" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="行政区划级次" prop="xzqhjc">
          <el-select v-model="editFormInfo['xzqhjc']" placeholder="选择区划级次" clearable size="small">
            <el-option label="省级" value="1"></el-option>
            <el-option label="市级" value="2"></el-option>
            <el-option label="区县" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="行政区划字母代码">
          <el-input v-model="editFormInfo.xzqhzmDm" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="行政区划罗马代码">
          <el-input v-model="editFormInfo.xzqhlmzmDm" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="上级行政区划名称" prop="sjxzqhszDm" v-if="editFormInfo.xzqhjc !== '1'">
          <el-cascader v-model="editFormInfo.sjxzqhszDm" :props="cascaderProps" :options="test_options" @change="cascaderChange"
                       v-if="isShowCascader" :show-all-levels="false" ref="cascaterNumber"></el-cascader>
        </el-form-item>
        <el-form-item label="上级行政区数字代码" v-if="editFormInfo.xzqhjc !== '1'">
          <el-input v-model="editFormInfo.sjxzqhszDm" readonly suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="行政区类型代码" prop="xzqhlxDm">
          <!--          <el-select v-model="editFormInfo['xzqhlxDm']" placeholder="选择区划级次" clearable size="small">-->
          <!--            <el-option label="行政区划" value="1"></el-option>-->
          <!--            <el-option label="经济区划" value="2"></el-option>-->
          <!--          </el-select>-->
          <el-radio-group v-model="editFormInfo['xzqhlxDm']">
            <el-radio label="1">行政区划</el-radio>
            <el-radio label="2">经济区划</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选用标志" prop="xybz">
          <el-switch v-model="editFormInfo['xybz']" active-color="#13ce66" inactive-color="#ff4949"
                     active-value="Y" inactive-value="N">
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="confirmEdit">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="删除行政区划" :visible.sync="deleteDialogVisible" width="650px" :before-close="handleClose">
      <DeleteRow @cancel="deleteDialogVisible = false" @confirm="confirmDelete"></DeleteRow>
    </el-dialog>
  </div>
</template>

<script>
import {mixins} from '@/mixins/mixins'
import Table from '@/components/Table'
import DeleteRow from '@/components/permission/DeleteRow'
import Vue from 'vue'

export default {
  name: 'Region',
  mixins: [mixins],
  components: {Table, DeleteRow},
  data() {
    let that = this
    return {
      colsHead: [{prop: 'xzqhmc', label: '行政区划名称'}, {prop: 'ssxzqmc', label: '所属行政区名称'}, {
        prop: 'xzqhjc', label: '级次'
      }, {prop: 'xzqhszDm', label: '本级次数字代码'}, {prop: 'sjxzqhszDm', label: '上级次数字代码'}],
      provinceList: [],
      cityList: [],
      isShowCascader: false,
      cascaderProps: {
        lazy: true,
        expandTrigger: 'hover',
        checkStrictly: true,
        lazyLoad(node, resolve) {
          setTimeout(() => {
            that.cascaderLazy(node, resolve)
            that.isShowAddressInfo = true
          }, 10)
        }
      },
      test_options: []
    }
  },
  mounted() {
    this.getProvince()
  },
  methods: {
    cascaderLazy(node, resolve) {
      let nodes = []
      const {level} = node
      if (level === 0) {
        Vue.axios.get('/xzqh/selectAllProvince')
            .then(res => {
              if (res.data.code.toString() === '200') {
                res.data.data.forEach((item) => {
                  nodes.push({label: item.xzqhmc, value: item.xzqhszDm, leaf: level >= 1})
                })
                resolve(nodes)
              }
            })
            .catch()
      } else if (level === 1) {
        let szDm = node.value || this.nodeId
        Vue.axios.get('/xzqh/selectXzqhBySzdm', {params: {szDm: szDm}})
            .then(res => {
              if (res.data.code.toString() === '200') {
                res.data.data.forEach((item) => {
                  nodes.push({label: item.xzqhmc, value: item.xzqhszDm, leaf: level >= 1})
                })
                resolve(nodes)
              }
            })
            .catch()
      } else {
        resolve([])
      }
    },
    search() {
      if (this.searchData.city && this.searchData.city != '') {
        this.searchData.szDm = this.searchData.city
      } else {
        this.searchData.szDm = this.searchData['province']
      }
      this.searchRow('/xzqh/selectXzqhBySzdm')
    },
    getProvince() {
      this.axios.get('/xzqh/selectAllProvince')
          .then(res => {
            if (res.data.code.toString() === '200') {
              this.provinceList = res.data.data
            }
          })
          .catch()
    },
    getCity(digital) {
      this.axios.get('/xzqh/selectXzqhBySzdm', {params: {szDm: digital}})
          .then(res => {
            if (res.data.code.toString() === '200') {
              this.cityList = res.data.data
            }
          })
          .catch()
    },
    provinceChange(val) {
      this.getCity(val)
      this.$set(this.searchData, 'city', '')
    },
//行政区划增删改
    selectRow(val) {
      this.selectedRows(val)
    },
    add() {
      this.dialogTitle = '新增行政区划'
      this.addRow()
    },
    update() {
      this.dialogTitle = '编辑行政区划'
      this.updateRow2('xzqhId', '/xzqh/selectXzqhInfo')
    },
    view(row) {
      this.dialogTitle = '查看行政区划信息'
      this.viewRow2(row, 'xzqhId', '/xzqh/selectXzqhInfo')
    },
    confirmEdit() {
      let val = this.editFormInfo.sjxzqhszDm
      let last = val instanceof Array ? val && val[val.length - 1] : val
      this.editFormInfo.sjxzqhszDm = this.editFormInfo.xzqhjc === '1' ? '' : last
      let pageUrl = this.searchData.xzqhszDm && this.searchData.xzqhszDm !== '' ? '/xzqh/selectXzqhBySzdm' : ''
      this.confirmEditRow('/xzqh/save', pageUrl)
    },
    deleteRows() {
      this.deleteRow()
    },
    confirmDelete() {
      this.confirmDeleteRow('/xzqh/delete', '/xzqh/selectXzqhBySzdm')
    },
    //选择上级数字代码填充上级名称
    cascaderChange(val){
      var end = val.slice(-1).toString();
      this.$set(this.editFormInfo,'sjxzqhszDm',end)
      let label = this.$refs.cascaterNumber.getCheckedNodes()[0].label
      this.editFormInfo.ssxzqmc = label
    }
  }
}
</script>

<style scoped lang='scss'>
.region-wrap {
  padding: 20px;

  > .searchForm {
    > .selectInput {
      width: 100px;
    }
  }

  .addForm {
    > .el-form-item {
      margin-bottom: 18px;

      &:nth-last-child(2), &:last-child {
        margin-bottom: 0;
      }
    }
  }

}
</style>