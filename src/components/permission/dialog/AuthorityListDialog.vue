<template>
  <div class="dialogWrap">
    <div class="role">
      <h3>岗位信息</h3>
      <ul>
        <li v-for="item in roleAdminList" :key="item.id">
          <SvgIcon icon-name="administrator" color="#ffb980" class="postIcon" size="medium"></SvgIcon>
          <p>{{item.name}}</p>
        </li>
        <li v-for="item in roleNoAdminList" :key="item.id">
          <SvgIcon icon-name="administrator" color="#2ec7c9" class="postIcon" size="medium"></SvgIcon>
          <p>{{item.name}}</p>
        </li>
      </ul>
    </div>
    <h3>权限信息</h3>
    <Table class="table" :colsHead="colsHead" :tableDatas="tableDatas1" :needButton="false" :needPage="false">
      <template #simple>
        <el-button size="small" class="update" type="primary" @click="relatedPost">
          <SvgIcon icon-name="post"></SvgIcon>
          关联岗位
        </el-button>
      </template>
    </Table>
    <el-dialog :title="relatedTitle" :visible.sync="relatedDialogVisible" append-to-body width="700px">
      <el-transfer
          filterable
          :filter-method="filterMethod"
          filter-placeholder="请输入"
          v-model="relatedValue"
          :data="transformData">
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="relatedDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="confirmTransform">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Table from '@/components/permission/Table'
import SvgIcon from '@/components/SvgIcon'
import {mixins} from '@/mixins/mixins'

export default {
  name: 'AuthorityListDialog',
  components: {Table,SvgIcon},
  mixins:[mixins],
  data() {
    return {
      colsHead: [{prop: 'name', label: '权限名称'}, {prop: 'describe', label: '权限描述'}],
    }
  },
  props:{
    tableDatas1:{type:Array},
    userId: {type:String},
    roleAdminList:{type:Array},
    roleNoAdminList:{type:Array},
  },
  methods:{
    relatedPost() {
      this.relatedName = 'post'
      this.related('/user/selectUserAndRole','关联岗位', {userId: this.userId})
    },
    confirmTransform() {this.confirmRelate('/role/saveUserRole', {
        type: '0',
        userIds: [this.userId],
        roleIds: this.relatedValue
      },)
    },
  }
}
</script>

<style scoped lang='scss'>
.dialogWrap{
  border-top: 1px solid #dcdfe6;
  h3{
    line-height: 20px;
    font-size: 18px;
    color: #303133;
    margin: 18px 0;
  }
  > .role{
    border-bottom: 1px solid #dcdfe6;
    padding-bottom: 18px;
    > ul{
      display: flex;
      > li{
        margin-right: 2em;
        text-align: center;
        > .postIcon{
          //margin-right: -1em;
        }
      }
    }
  }
}
</style>