<template>
  <div class="login">
    <div class="title">欢迎你，登录{{ systemName }}用户管理系统</div>
    <div class="login-form-wrap">
      <p class="form-title">用户登录</p>
      <el-form :model="loginInfo" class="login-form">
        <el-form-item class="user-item">
          <el-input v-model="loginInfo.username" placeholder="请输入用户名" class="input-wrap" :class="{focusUser}">
            <img slot="prefix" :src="require('../assets/images/'+userImg)">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="loginInfo.password" placeholder="请输入密码" type="password" class="input-wrap"
                    :class="{focusKey}">
            <img slot="prefix" :src="require('../assets/images/'+keyImg)">
          </el-input>
        </el-form-item>
        <el-form-item class="button-item">
          <el-button type="primary" @click="onSubmit" size="small" class="login-button" :class="{clickable}"
                     :disabled="!clickable">登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Qs from 'qs'

export default {
  name: 'Login',
  data() {
    return {
      systemName: '天正',
      loginInfo: {
        username: '',
        password: ''
      },
      userImg: 'user_icon_gray.png',
      keyImg: 'key_icon_gray.png',
      focusUser: false,
      focusKey: false,
      clickable: false,
    }
  },
  watch: {
    loginInfo: {
      handler(newVal) {
        this.isLogin(newVal)
      },
      immediate: true,
      deep: true
    },
    mounted() {
      this.isLogin(this.loginInfo)
    },
  },
  methods: {
    isLogin(val) {
      if (val.username.length > 0) {
        this.focusUser = true
        this.userImg = 'user_icon_light.png'
      } else {
        this.focusUser = false
        this.userImg = 'user_icon_gray.png'
      }
      if (val.password.length > 0) {
        this.focusKey = true
        this.keyImg = 'key_icon_light.png'
      } else {
        this.focusKey = false
        this.keyImg = 'key_icon_gray.png'
      }
      val.username.length > 0 && val.password.length > 0 ? this.clickable = true : this.clickable = false
    },
    onSubmit() {
      this.axios.post(this.prefixAddr + '/topcheer/login',
          Qs.stringify({...this.loginInfo})
      ).then(res => {
        console.log(res)
      })
          .catch()
      this.$router.push('/HomePage')
    },
  }
}
</script>

<style scoped lang='scss'>
.login {
  background: url("../assets/images/bg.png");
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  > .title {
    font-size: 40px;
    font-weight: 500;
    color: #F9FAFB;
    text-align: center;
    padding-top: 150px;
  }

  > .login-form-wrap {
    width: 460px;
    height: 394px;
    background: #F9FAFB;
    border-radius: 16px;
    margin-top: 80px;

    > .form-title {
      font-size: 24px;
      color: #333333;
      text-align: center;
      padding-top: 48px;
    }

    > .login-form {
      padding: 40px 60px 0;

      > .user-item {
        margin-bottom: 47px;
      }

      > .button-item {
        padding: 20px 0;

        .login-button {
          height: 40px;
          width: 100%;
          background: #E5E5E5;
          color: #999999;
          border: 1px solid #E5E5E5;
        }

        .clickable {
          background: #1890FF;
          color: #ffffff;
          border: 1px solid #1890FF;
        }
      }

      .input-wrap ::v-deep {
        > input {
          border: none;
          border-radius: 0;
          border-bottom: 1px solid #B8BCBF;
          background: #F9FAFB;
        }

        img {
          height: 20px;
          width: 20px;
          margin: 10px 0;
        }
      }

      .focusUser ::v-deep, .focusKey ::v-deep {
        > input {
          border-bottom: 1px solid #1890FF;
        }
      }
    }
  }
}
</style>