<template>
  <div class="user-center-wrap">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>个人资料</span>
        <el-button style="float: right; padding: 3px 0.5em" type="text" @click="isEdit = false">修改</el-button>
        <el-button style="float: right; padding: 3px 0.5em" type="text" @click="updateUesrInfo">保存</el-button>
      </div>
      <el-form ref="form" :model="userInfo" label-width="80px" class="form" :disabled="isEdit">
        <el-form-item label="头像" class="formItem avatarItem">
          <div class="avatar-wrap">
            <AvatarUploader class="avatar" @update:img="updateImg" :img-path="xxxxx"></AvatarUploader>
            <span>支持 jpg、png、jpeg 格式大小 2M 以内的图片</span>
          </div>
        </el-form-item>
        <el-form-item label="用户名称" class="formItem">
          <el-input v-model="userInfo.name" size="small" class="infoInput" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="密码" class="formItem">
          <el-input v-model="userInfo.password" size="small" class="infoInput" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item label="部门" class="formItem">
          <el-input v-model="userInfo.department" size="small" class="infoInput" placeholder="部门" readonly></el-input>
        </el-form-item>
        <el-form-item label="用户状态" class="formItem">
          <el-input v-model="userInfo.status" size="small" class="infoInput" placeholder="用户状态" readonly></el-input>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import AvatarUploader from '@/components/permission/AvatarUploader'

export default {
  name: 'UserCenter',
  components:{AvatarUploader},
  data() {
    return {
      userInfo: {},
      imgId:'',
      isEdit:true,
    }
  },
  methods:{
//获取头像组件的数据
    updateImg(value) {
      this.imgId = value
    },
    updateUesrInfo(){
      console.log(this.userInfo)
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
  min-width: 480px;
}

.user-center-wrap {
  display: flex;
  justify-content: center;
  margin-top: 30px;

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
  }
}

</style>