<template>
<div class="dialog-wrap">
  <div class="title-wrap">
    <h2 class="title">标题1</h2>
    <ul class="notes">
      <li><span>发件人：</span><span>xxx</span></li>
      <li><span>发送时间：</span><span>2020-12-4</span></li>
    </ul>
  </div>
  <section>
    这是一段内容
    这是一段内容
    这是一段内容
    这是一段内容
    这是一段内容
    这是一段内容
    这是一段内容
    这是一段内容
    这是一段内容
    这是一段内容
    这是一段内容
    这是一段内容
    这是一段内容
    这是一段内容
    这是一段内容
    这是一段内容
  </section>
</div>
</template>

<script>
export default {
name: "NewsDialog"
}
</script>

<style scoped lang='scss'>
.dialog-wrap{
  color: #666666;
  margin-top: -20px;
  > .title-wrap{
    > .title{
      margin-bottom: 10px;
    }
    > ul{
      display: flex;
      font-size: 12px;
      color: #858585;
      margin-bottom: 10px;
      > li{
        margin-right: 2em;
      }
    }
  }
}
</style>