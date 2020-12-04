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
          <el-button type="primary" @click="loginSubmit" size="small" class="login-button" :class="{clickable}"
                     :disabled="!clickable">登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="请选择用户岗位" :visible.sync="selectDialogVisible" width="486px" :before-close="handleClose"
               class="selectPostDialog">
      <div class="select-user-wrap">
        <el-radio-group v-model="radio1" class="radio-wrap" @change="radioChange">
          <el-radio :label="post.id" border class="radio" v-for="post in posts" :key="post.id">{{ post.name }}
          </el-radio>
        </el-radio-group>
        <p slot="footer" class="footer">
          <el-button @click="selectDialogVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="selectedUser" size="small">确 定</el-button>
        </p>
      </div>
    </el-dialog>
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
      selectDialogVisible: false,
      radio1: '',
      posts: [],
      userId: '',
      token: ''
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
  },
  mounted() {
    // this.axios.get('/getCsrf', {})
    //     .then(res => {
    //       if (res.data.code === 200) {
    //         window.localStorage.setItem('token', res.data.data.token)
    //       }
    //     })
    //     .catch()
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
    loginSubmit() {
      // this.$router.push('/HomePage')
      this.axios.post('/auth',
          Qs.stringify({...this.loginInfo})
      ).then(res => {
        if (res.data.code === 200) {
          if (res.data.data['userList'].length > 1) {
            this.selectDialogVisible = true
            window.localStorage.setItem('token', res.data.data.token)
            this.posts = res.data.data['userList']
          } else {this.userId = res.data.data['userList'][0].id}
        } else {this.$message.error(res.data.msg)}
      })
          .catch()
    },
    radioChange(value) {
      this.userId = value
    },
    selectedUser() {
      if (this.userId !== '') {
        this.selectDialogVisible = false
        this.daveUser()
      } else {
        this.$message.error('请选择一个用户')
      }
    },
    daveUser() {
      this.axios.post('/user/selectUserPower',
          Qs.stringify({userId: this.userId}))
          .then(res => {
            if (res.data.code === 200) {
              this.$router.push('/HomePage')
            } else {this.$message.error(res.data.msg)}
          })
          .catch()
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(() => {
            done()
          })
          .catch(() => {})
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

  > .selectPostDialog {
    &::v-deep {
      .el-dialog__body {
        padding: 0;
      }
    }

    &::v-deep {
      .el-dialog__header {
        background: #F9FAFB;
      }
    }

    .select-user-wrap {
      width: 486px;
      height: 360px;
      background: #F9FAFB;
      border-radius: 8px;
      padding: 0 51px 32px;
      overflow: auto;

      > .radio-wrap {
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
          background: #F7F7F7;

          &:first-child {
            margin-top: 20px;
          }
        }
      }

      > .footer {
        margin-top: 40px;
        text-align: center;
      }
    }
  }
}
</style>