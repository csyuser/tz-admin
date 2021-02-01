<template>
  <div class="region-wrap">
    <el-form :inline="true" :model="searchData" class="demo-form-inline searchForm">
      <el-form-item>
        <el-select v-model="searchData['province']" placeholder="选择省份" clearable size="small" @change="provinceChange">
          <el-option :label="item['xzqhmc']" :value="item['xzqhszDm']" v-for="item in provinceList"
                     :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchData['city']" placeholder="选择市级" clearable size="small" :disabled="!provinceSelected">
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
        <el-form-item label="行政区类型代码" prop="xzqhlxDm">
          <el-select v-model="editFormInfo['xzqhlxDm']" placeholder="选择区划级次" clearable size="small">
            <el-option label="行政区划" value="1"></el-option>
            <el-option label="经济区划" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上级行政区划名称">
          <el-input v-model="editFormInfo.ssxzqmc" suffix-icon="xxx"></el-input>
        </el-form-item>
        <el-form-item label="上级行政区数字代码" prop="sjxzqhszDm" v-if="editFormInfo.xzqhjc !== '1'">
          <el-cascader v-model="editFormInfo.sjxzqhszDm" :props="cascaderProps"></el-cascader>
        </el-form-item>
        <el-form-item label="选用标志" prop="xybz">
          <el-switch v-model="editFormInfo['xybz']" active-color="#13ce66" inactive-color="#ff4949"
                     active-value="1" inactive-value="0">
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
  components: {Table,DeleteRow},
  data() {
    return {
      colsHead: [{prop: 'xzqhmc', label: '行政区划名称'}, {prop: 'ssxzqmc', label: '所属行政区名称'}, {
        prop: 'xzqhjc', label: '级次'
      }, {prop: 'xzqhszDm', label: '本级次数字代码'}, {prop: 'sjxzqhszDm', label: '上级次数字代码'}],
      provinceList: [],
      cityList: [],
      provinceSelected: false,
      cascaderProps: {
        lazy: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          const {level} = node
          setTimeout(() => {
            let nodes = []
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
              Vue.axios.get('/xzqh/selectXzqhBySzdm', {params: {szDm: node.value}})
                  .then(res => {
                    if (res.data.code.toString() === '200') {
                      res.data.data.forEach((item) => {
                        nodes.push({label: item.xzqhmc, value: item.xzqhszDm, leaf: level >= 1})
                      })
                      resolve(nodes)
                    }
                  })
                  .catch()
            } else {resolve([])}
          }, 10)

          // 通过调用resolve将子节点数据返回，通知组件数据加载完成
        }
      }
    }
  },
  mounted() {
    this.getProvince()
  },
  methods: {
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
      this.provinceSelected = true
      this.$set(this.searchData, 'city', '')
    },
    cascaderChange() {

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
      this.updateRow2('szDm', '/xzqh/selectXzqhBySzdm')
    },
    view(row) {
      this.dialogTitle = '查看行政区划信息'
      this.viewRow2(row, 'szDm', '/xzqh/selectXzqhBySzdm')
    },
    confirmEdit() {
      let val = this.editFormInfo.sjxzqhszDm
      const last = val && val[val.length - 1]
      this.editFormInfo.sjxzqhszDm = last
      let pageUrl = this.searchData.xzqhszDm && this.searchData.xzqhszDm !== '' ? '/xzqh/selectXzqhBySzdm' : ''
      console.log('pageUrl')
      console.log(pageUrl)
      this.confirmEditRow('/xzqh/save', pageUrl)

    },
    deleteRows() {
      this.deleteRow()
    },
    confirmDelete() {
      this.confirmDeleteRow('/role/delete', '/xzqh/selectXzqhBySzdm')
    },
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