<template>
  <div class="dialogWrap">
    <h3>权限信息</h3>
    <Table class="roleTable" :colsHead="colsHead" :tableDatas="tableDatas1" :needButton="false" :needPage="false" :need-select="false">
      <template #simple>
        <el-button size="small" class="update" type="primary" @click="$emit('update:relatePermission',$event)"
                   :disabled="type ==='view'" v-if="needBtn">
          {{ ButtonTitle}}
        </el-button>
      </template>
    </Table>
  </div>
</template>

<script>
import Table from '@/components/Table'

export default {
  name: 'AuthorityListDialog',
  components: {Table},
  data() {
    return {
      colsHead: [{prop: 'name', label: '权限名称'}, {prop: 'describe', label: '权限描述'}],
    }
  },
  props: {
    tableDatas1: {type: Array},
    userId: {type: String},
    type: {type: String},
    needBtn: {
      type: Boolean,
      default:false
    },
    ButtonTitle: {type: String},
  },
}
</script>

<style scoped lang='scss'>
.dialogWrap {
  border-top: 1px solid #dcdfe6;
  margin-top: 18px;

  h3 {
    line-height: 20px;
    font-size: 18px;
    color: #303133;
    margin: 18px 0;
  }

  > .roleTable {
    margin-left: 2em;
  }
}
</style>