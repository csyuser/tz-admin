<template>
  <div class="region-wrap">
    <el-form :inline="true" :model="searchData" class="demo-form-inline searchForm">
      <el-form-item>
        <el-select v-model="searchData['province']" placeholder="选择省份" clearable size="small" @change="provinceChange">
          <el-option :label="item['xzqhmc']" :value="item['xzqhszDm']" v-for="item in provinceList" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchData['city']" placeholder="选择市级" clearable size="small" :disabled="!provinceSelected">
          <el-option :label="item['xzqhmc']" :value="item['xzqhszDm']" v-for="item in cityList" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" size="small">查询</el-button>
      </el-form-item>
    </el-form>
    <Table :colsHead="colsHead" :tableDatas="tableDatas" :need-page="false" :need-update="false">
    </Table>
  </div>
</template>

<script>
import {mixins} from '@/mixins/mixins'
import Table from '@/components/Table'

export default {
  name: 'Region',
  mixins: [mixins],
  components:{Table},
  data() {
    return {
      colsHead: [{prop: 'xzqhmc', label: '行政区划名称'}, {prop: 'ssxzqmc', label: '所属行政区名称'}, {
        prop: 'xzqhjc', label: '级次'
      }, {prop: 'xzqhszDm', label: '本级次数字代码'}, {prop: 'sjxzqhszDm', label: '上级次数字代码'}],
      provinceList:[],
      cityList:[],
      provinceSelected:false,
    }
  },
  mounted() {
    this.getProvince()
  },
  methods: {
    search() {
      if (this.searchData.city && this.searchData.city!=''){
        this.searchData.szDm = this.searchData.city
      }else {
        this.searchData.szDm = this.searchData['province']
      }
      this.searchRow('/xzqh/selectXzqhBySzdm')
    },
    getProvince(){
      this.axios.get('/xzqh/selectAllProvince')
      .then(res=>{
        if (res.data.code.toString() === '200'){
          this.provinceList = res.data.data
        }
      })
      .catch()
    },
    getCity(digital){
      this.axios.get('/xzqh/selectXzqhBySzdm',{params:{szDm:digital}})
          .then(res=>{
            if (res.data.code.toString() === '200'){
              this.cityList = res.data.data
            }
          })
          .catch()
    },
    provinceChange(val){
      // console.log('zhixingle')
      this.getCity(val)
      this.provinceSelected = true
      this.$set(this.searchData,'city','')
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

}
</style>