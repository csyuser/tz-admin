<template>
  <div class="deleteRow">
    <p class="title">确定删除所选行吗</p>
    <p slot="footer" class="footer">
      <el-button @click="$emit('cancel',$event)" size="small">取 消</el-button>
      <el-button type="primary" @click="$emit('confirm',$event)" size="small">确 定</el-button>
    </p>
  </div>
</template>

<script>
export default {
  name: 'DeleteRow'
}
</script>

<style scoped lang='scss'>
.deleteRow {
  margin-top: -10px;

  > .title {
    padding-bottom: 20px;
  }

  > .footer {
    display: flex;
    justify-content: flex-end;
  }
}
</style>