<template>
  <div class="menu-manege-wrap">
    <el-form :inline="true" :model="menuInfo" class="demo-form-inline searchForm">
      <el-form-item>
        <el-input v-model="menuInfo.name" placeholder="菜单名称" size="small"></el-input>
      </el-form-item>
      <el-form-item class="selectInput">
        <el-select v-model="menuInfo.previousMenu" placeholder="上级菜单" size="small">
          <el-option label="激活" value="active"></el-option>
          <el-option label="失效" value="disabled"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="selectInput">
        <el-select v-model="menuInfo.menuType" placeholder="菜单类型" size="small">
          <el-option label="激活" value="active"></el-option>
          <el-option label="失效" value="disabled"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit" size="small">查询</el-button>
      </el-form-item>
    </el-form>
    <Table :colsHead="colsHead" :tableDatas="tableDatas"></Table>
  </div>
</template>

<script>
import Table from '@/components/permission/Table'
export default {
  name: 'MenuManage',
  components:{Table},
  data(){
    return{
      menuInfo:{
        name:'',
        previousMenu:'',
        menuType:''
      },
      colsHead: [{prop: 'order', label: '菜单序号'}, {prop: 'name', label: '菜单名称'},{prop: 'previousMenu', label: '上级菜单'}, {prop: 'menuType', label: '菜单类型'}, {prop: 'url', label: '应用地址url'}, {prop: 'date', label: '创建日期'}],
      tableDatas: {
        count: 30,
        tableData: [{
          id: 1,
          order:'1',
          name:'权限管理',
          previousMenu:'',
          menuType:'功能菜单',
          url:'',
          date: '2016-05-02',
          children:[{
            id: '1-1',
            order:'1',
            name:'用户管理',
            previousMenu:'权限管理',
            menuType:'功能菜单',
            url:'/MenuManage',
            date: '2016-05-02',
          },{
            id: 1-2,
            order:'2',
            name:'岗位管理',
            previousMenu:'权限管理',
            menuType:'功能菜单',
            url:'/MenuManage',
            date: '2016-05-02',
          },{
            id: '1-4',
            order:'3',
            name:'菜单管理',
            previousMenu:'权限管理',
            menuType:'功能菜单',
            url:'/MenuManage',
            date: '2016-05-02',
          }]
        },  {
          id: 4,
          order:'4',
          name:'用户管理',
          previousMenu:'权限管理',
          menuType:'功能菜单',
          url:'/MenuManage',
          date: '2016-05-02',
        }],
      },
    }
  },
  methods:{
    submit(){
      console.log(this.menuInfo)
    }
  }
}
</script>

<style scoped lang='scss'>
.menu-manege-wrap{
  padding: 20px;
  > .searchForm {
    > .selectInput {
      width: 150px;
    }
  }
}

</style>