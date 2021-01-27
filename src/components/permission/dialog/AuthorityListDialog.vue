<template>
  <div class="dialogWrap">
    <h3>权限信息</h3>
    <Table class="roleTable" :colsHead="colsHead" :tableDatas="tableDatas1" :needButton="false" :needPage="false">
      <template #simple>
        <el-button size="small" class="update" type="primary" @click="$emit('update:relatePermission',$event)"
                   :disabled="type !=='update'" v-if="needBtn">
          <SvgIcon icon-name="permission"></SvgIcon>
          关联权限
        </el-button>
      </template>
    </Table>
  </div>
</template>

<script>
import Table from '@/components/Table'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'AuthorityListDialog',
  components: {Table, SvgIcon},
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
    }
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