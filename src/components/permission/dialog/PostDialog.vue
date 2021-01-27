<template>
  <div class="post-dialog-wrap">
    <div class="role">
      <div class="title">
        <h3>{{ titleType }}信息</h3>
        <el-button size="small" class="update" type="primary" @click="$emit('update:relate',$event)" :disabled="type !=='update'">
          <!--          <SvgIcon icon-name="post"></SvgIcon>-->
          关联{{ titleType }}
        </el-button>
      </div>
      <ul>
        <li v-for="item in roleAdminList" :key="item.id">
          <SvgIcon icon-name="administrator" color="#ffb980" class="postIcon" size="medium"></SvgIcon>
          <p>{{ item.name }}</p>
        </li>
        <li v-for="item in roleNoAdminList" :key="item.id">
          <SvgIcon icon-name="administrator" color="#2ec7c9" class="postIcon" size="medium"></SvgIcon>
          <p>{{ item.name }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
export default {
  name: 'PostDialog',
  components: {SvgIcon},
  props: {
    roleAdminList: {type: Array},
    roleNoAdminList: {type: Array},
    type:{type:String},
    titleType:{type:String}
  },
}
</script>

<style scoped lang='scss'>
.post-dialog-wrap{
  margin-top: 18px;
  h3{
    line-height: 20px;
    font-size: 18px;
    color: #303133;
    margin: 18px 0;
  }
  > .role{
    border-top: 1px solid #dcdfe6;
    padding-bottom: 18px;
    > .title{
      display: flex;
      align-items: center;
      justify-content: space-between;
      > button{
        height: 30px;
        margin-left: 1em;
      }
    }
    > ul{
      margin-left: 2em;
      display: flex;
      flex-wrap: wrap;
      > li{
        margin-right: 2em;
        text-align: center;
        > .postIcon{
          margin-bottom: 0.3em;
        }
      }
    }
  }
}
</style>