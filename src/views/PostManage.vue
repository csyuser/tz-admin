<template>
  <div class="post-manage-wrap">
    <Table :colsHead="colsHead"></Table>
  </div>
</template>

<script>
import Table from '@/components/Table'

export default {
  name: 'PostManage',
  components: {Table},
  data() {
    return {
      colsHead: [{prop: 'name', label: '用户名'}, {prop: 'post', label: '岗位'}, {prop: 'gender', label: '性别'},
        {prop: 'phone', label: '电话'}, {prop: 'mail', label: '邮箱'}, {prop: 'type', label: '状态'}, {prop: 'date', label: '创建日期'}],
      tableDatas:{},

    }
  },
  mounted() {

  }
}
</script>

<style scoped lang='scss'>

</style>