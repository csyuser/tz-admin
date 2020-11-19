<template>
  <div class="login">
        <el-button type="primary" @click="login">登陆啦</el-button>
  </div>
</template>

<script>
export default {
  name: 'Login',
  methods: {
    login() {
      this.$router.push('/HomePage')
    }
  }
}
</script>

<style scoped lang='scss'>
.login {
  margin: 20px;
}
</style>