<template>
  <div class="dialogWrap">
    <h3>权限信息</h3>
    <Table class="table" :colsHead="colsHead" :tableDatas="tableDatas1" :needButton="false" :needPage="false">
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
    tableDatas1:{type:Array}
  }
}
</script>

<style scoped lang='scss'>
.dialogWrap{
  border-top: 1px solid #dcdfe6;
  > h3{
    line-height: 20px;
    font-size: 18px;
    color: #303133;
    margin-top: 18px;
  }
}
</style>