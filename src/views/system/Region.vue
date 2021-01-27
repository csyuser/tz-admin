<template>
  <div class="region-wrap">
    <el-form :inline="true" :model="searchData" class="demo-form-inline searchForm">
      <el-form-item>
        <el-input v-model="searchData.name" placeholder="输入名称" size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" size="small">查询</el-button>
      </el-form-item>
    </el-form>
    <Table :colsHead="colsHead" :tableDatas="tableDatas" :pageSize="pageSize" :page="page">
    </Table>
  </div>
</template>

<script>
import {mixins} from '@/mixins/mixins'

export default {
  name: 'Region',
  mixins:[mixins],
  data() {
    return {
      colsHead: [{prop: 'name', label: '行政区划名称'}, {prop: 'code', label: '所属行政区名称'}, {
        prop: 'departmentName', label: '级次'}, {prop: 'roleType', label: '本级次数字代码'}, {prop: 'describe', label: '上级次数字代码'}],
    }
  },
  methods:{
    search() {
      // this.searchRow('/role/page')
    },
  }
}
</script>

<style scoped lang='scss'>

</style>