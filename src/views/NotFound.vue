<template>
  <div class="notFound">
    <div>404 页面不存在</div>
    <div><router-link to="/HomePage"><el-button type="text">返回首页</el-button></router-link> </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
};
</script>

<style lang="scss" scoped>
.notFound{
  padding:100px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>