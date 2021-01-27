<template>
  <div class="dialogWrap">
    <h3>权限信息</h3>
    <Table class="roleTable" :colsHead="colsHead" :tableDatas="tableDatas1" :needButton="false" :needPage="false">
    </Table>
  </div>
</template>

<script>
import Table from '@/components/permission/Table'

export default {
  name: 'AuthorityListDialog',
  components: {Table},
  data() {
    return {
      colsHead: [{prop: 'name', label: '权限名称'}, {prop: 'describe', label: '权限描述'}],
    }
  },
  props:{
    tableDatas1:{type:Array},
    userId: {type:String},
  },
}
</script>

<style scoped lang='scss'>
.dialogWrap{
  border-top: 1px solid #dcdfe6;
  margin-top: 18px;
  h3{
    line-height: 20px;
    font-size: 18px;
    color: #303133;
    margin: 18px 0;
  }
  //> .role{
  //  border-bottom: 1px solid #dcdfe6;
  //  padding-bottom: 18px;
  //  > .title{
  //    display: flex;
  //    align-items: center;
  //    justify-content: space-between;
  //    > button{
  //      height: 30px;
  //      margin-left: 1em;
  //    }
  //  }
  //  > ul{
  //    margin-left: 2em;
  //    display: flex;
  //    flex-wrap: wrap;
  //    > li{
  //      margin-right: 2em;
  //      text-align: center;
  //      > .postIcon{
  //        margin-bottom: 0.3em;
  //      }
  //    }
  //  }
  //}
  > .roleTable{
    margin-left: 2em;
  }
}
</style>