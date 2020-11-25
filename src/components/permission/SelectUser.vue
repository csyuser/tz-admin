<template>
    <div class="select-user-wrap">
      <div class="radio-wrap">
        <el-radio v-model="radio1" label="1" border class="radio">备选项1</el-radio>
        <el-radio v-model="radio1" label="2" border class="radio">备选项2</el-radio>
        <el-radio v-model="radio1" label="3" border class="radio">备选项3</el-radio>
      </div>
      <p slot="footer" class="footer">
        <el-button @click="$emit('cancel',$event)" size="small">取 消</el-button>
        <el-button type="primary" @click="$emit('confirm',$event)" size="small">确 定</el-button>
      </p>
    </div>
</template>

<script>
export default {
  name: 'SelectUser',
  data() {
    return {
      radio1: ''
    }
  }
}
</script>

<style scoped lang='scss'>
  .select-user-wrap {
    width: 486px;
    height: 360px;
    background: #F9FAFB;
    border-radius: 8px;
    padding:0 51px 32px;
    overflow: auto;

    > .radio-wrap{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      > .radio {
        width: 100%;
        height: 60px;
        margin: 16px 0 0;
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;
        align-items: center;
        padding-top: 0;
        &:first-child{
          margin-top: 20px;
          margin-left: 10px;
        }
      }
    }
    > .footer{
      margin-top: 40px;
      text-align: center;
    }

  }
//}
</style>