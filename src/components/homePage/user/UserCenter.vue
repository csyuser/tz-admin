<template>
  <div class="user-center-wrap">
    <el-card class="box-card">
      <div slot="header" class="clearfix header">
        <div class="icon-wrap"  @click="back">
          <SvgIcon icon-name="back" class="icon-back"></SvgIcon>
        </div>
        <span>个人资料</span>
        <div class="buttons">
          <el-button type="text" @click="isEdit = true" class="update" v-if="!isEdit">修改资料</el-button>
          <el-button type="text" @click="updateUesrInfo" class="update" v-if="isEdit">保存更改</el-button>
          <el-button type="text" @click="cancelUpdate" v-if="isEdit">取消修改</el-button>
        </div>
      </div>
      <el-form :model="userInfo" label-width="80px" class="form">
        <el-form-item label="头像" class="formItem avatarItem">
          <div class="avatar-wrap">
            <AvatarUploader class="avatar" @update:img="updateImg" :img-path="userInfo['photoPath']" :disabled="!isEdit"></AvatarUploader>
            <span>支持 jpg、png、jpeg 格式大小 2M 以内的图片</span>
          </div>
        </el-form-item>
        <el-form-item label="用户名称" class="formItem">
          <el-input v-model="userInfo.name" size="small" class="infoInput" :class="{readonly:!isEdit}" placeholder="名称" :readonly="!isEdit"></el-input>
        </el-form-item>
        <el-form-item label="密码" class="formItem">
          <el-input v-model="userInfo.password" size="small" class="infoInput" :class="{readonly:!isEdit}" placeholder="密码" type="password" :readonly="!isEdit"></el-input>
        </el-form-item>
        <el-form-item label="部门" class="formItem">
          <el-input v-model="userInfo['departmentName']" size="small" class="infoInput readonly" placeholder="暂无数据" readonly></el-input>
        </el-form-item>
        <el-form-item label="用户状态" class="formItem">
          <el-input :value="formatUserStatus(userInfo.status)" size="small" class="infoInput readonly" placeholder="用户状态" readonly></el-input>
        </el-form-item>
      </el-form>
    </el-card>

  </div>
</template>

<script>
import AvatarUploader from '@/components/permission/AvatarUploader'
import SvgIcon from '@/components/SvgIcon'
import {helper} from '@/views/method'

export default {
  name: 'UserCenter',
  components:{AvatarUploader,SvgIcon},
  data() {
    return {
      userInfo: {},
      userId: '',
      imgId:'',
      isEdit:false,
    }
  },
  mounted() {
    this.$store.commit('getUserInfo')
    this.userId = this.$store.state.userInfo.id
    this.getUserInfo()
  },
  methods:{
//获取头像组件的数据
    updateImg(value) {
      this.imgId = value
    },
    updateUesrInfo(){
     this.isEdit = false
     let editData = {id: this.userId, ...this.userInfo, photoId: this.imgId}
      this.axios.post('/user/save', {...editData})
          .then(res => {
            if (res.data.code.toString() === '200') {
              this.$message.success('保存成功')
              this.getUserInfo()
            }
          })
          .catch()
    },
    getUserInfo(){
      this.axios.get('/user/selectUserInfo', {
        params: {userId:this.userId}
      }).then(res => {
        if (res.data.code.toString() === '200') {
          this.userInfo = res.data.data
          this.imgId = res.data.data.photoId
          let info = {}
          info.code =this.userInfo.code
          info.name = this.userInfo.name
          info.id = this.userInfo.id
          info.photoPath = this.userInfo.photoPath
          window.localStorage.setItem('userInfo', JSON.stringify(info))
          this.$store.commit('getUserInfo')
        }
      })
          .catch()
    },
    cancelUpdate(){
      this.isEdit = false
      this.getUserInfo()
    },
    formatUserStatus(val){
     return helper.userStatus(val)
    },
    back(){
      console.log('执行了')
      this.$router.back()
    }
  }
}
</script>

<style scoped lang='scss'>
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.box-card {
  min-width:600px;
  .header{
    display: flex;
    align-items: center;
    position: relative;
    > .icon-wrap{
      cursor: pointer;
      &:hover > .icon-back{color: #409EFF}
      > .icon-back{
        font-size: 18px;
        font-weight: bold;
        color: #606266;
      }
    }
    span{
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      font-size: 24px;
      font-weight: bold
    }
    > .buttons{
      margin-left: auto;
    }
  }
}

.user-center-wrap {
  display: flex;
  justify-content: center;
  margin-top: 20px;

  .form {
    > .formItem {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #DCDFE6;
      .avatar-wrap{
        display: flex;
        align-items: center;
        > span{
          color: #909090;
          font-size: 12px;
          margin-left: 30px
        }
        > .avatar{
          padding-left: 15px;
          margin-bottom: 15px;
        }
      }
      & ::v-deep{
        .el-form-item__content{
          margin-left: 0 !important;
          width: calc(100% - 80px);
        }
      }
      >.avatarItem ::v-deep{
          .el-form-item__label{
            margin-bottom: 15px;
        }
      }
    }

    .infoInput{
      & ::v-deep {
        > input {
          border: none;
          border-radius: 0;
        }
      }
    }
    .readonly ::v-deep{
      > input {
        color: #c0c4cc;
      }
    }
  }
}

</style>