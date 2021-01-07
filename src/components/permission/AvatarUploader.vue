<template>
  <el-upload
      class="avatar-uploader"
      :action="uploadUrl"
      :headers="headersToken"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload">
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
export default {
  name: 'AvatarUploader',
  data() {
    return {
      imageUrl: '',
      imgId:''
    }
  },
  computed:{
    uploadUrl: function (){
      return this.BASE_URL + '/file/upload'
    },
    headersToken:function (){
      return {Authorization: window.localStorage.getItem('token')}
    }
  },
  watch:{
    imgId(newValue,oldValue){
      if (oldValue !== ''){
        console.log(oldValue)
      }
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      console.log('上传成功')
      console.log(res)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG 和 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return (isJPG || isPNG) && isLt2M
    },
  }
}
</script>

<style scoped lang='scss'>
$avatarWidth: 50px;
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: $avatarWidth;
  height: $avatarWidth;
  line-height: $avatarWidth;
  text-align: center;
  border: 1px dashed #d9d9d9;
  background: #fbfdff;
  border-radius: 6px;
}

.avatar {
  width: $avatarWidth;
  height: $avatarWidth;
  display: block;
}
</style>