<template>
  <div class="newsList-wrap">{{ newsType }}
    <el-form :inline="true" :model="searchData" class="demo-form-inline searchForm">
      <el-form-item class="input">
        <el-input v-model="title" placeholder="输入标题" size="small" suffix-icon="xxx"></el-input>
      </el-form-item>
      <el-form-item class="input">
        <el-select v-model="searchData['type']" placeholder="消息状态" clearable size="small">
          <el-option label="已读" value="0"></el-option>
          <el-option label="未读" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" size="small">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="buttons">
      <el-button size="small" class="update" type="primary" v-if="searchData.queryType === '1'">
        <i class="el-icon-plus"></i>
        新建
      </el-button>
      <el-button size="small" class="update" type="primary" @click="view">
        <i class="el-icon-reading"></i>
        查看详情
      </el-button>
      <el-button size="small" class="update" @click="remarkRead"
                 v-if="searchData.queryType === '0' || searchData.privateType === '1'">
        <i class="el-icon-check"></i>
        标为已读
      </el-button>
      <el-button size="small" class="update" @click="remarkAllRead"
                 v-if="searchData.queryType === '0' || searchData.privateType === '1'">
        <i class="el-icon-check"></i>
        全部标为已读
      </el-button>
      <el-button size="small" class="update" @click="reply"
                 v-if="searchData.queryType === '1' && isReply">
        <i class="el-icon-chat-line-round"></i>
        回复
      </el-button>
    </div>
    <el-tabs v-model="searchData.privateType" class="tab" v-if="searchData.queryType === '1'">
      <el-tab-pane label="收件箱" name="1">
        <Table class="table" :colsHead="colsHead" :tableDatas="tableDatas" :pageSize="pageSize" :page="page"
               :need-button="false"
               @currentChange="currentChange" @postSelect="selectRow" is-news="true">
        </Table>
      </el-tab-pane>
      <el-tab-pane label="已发消息" name="0">
        <Table class="table" :colsHead="colsHead" :tableDatas="tableDatas" :pageSize="pageSize" :page="page"
               :need-button="false"
               @currentChange="currentChange" @postSelect="selectRow" :is-news="true">
        </Table>
      </el-tab-pane>
    </el-tabs>
    <Table class="table" :colsHead="colsHead" :tableDatas="tableDatas" :pageSize="pageSize" :page="page"
           :need-button="false" v-if="searchData.queryType === '0'"
           @currentChange="currentChange" @postSelect="selectRow" :is-news="true">
    </Table>
<!--    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="80%" @close="closeDialog">-->
<!--      <NewsDialog></NewsDialog>-->
<!--      <span slot="footer" class="dialog-footer">-->
<!--  </span>-->
<!--    </el-dialog>-->
  </div>
</template>

<script>
import Table from '@/components/permission/Table'
import Qs from 'qs'

export default {
  name: 'NewsList',
  components: {Table},
  data() {
    return {
      colsHead: [{prop: 'title', label: '标题'}, {prop: 'fromUserName', label: '发送人'}, {prop: 'type', label: '状态'}, {
        prop: 'createTime',
        label: '发送时间'
      }],
      tableDatas: [],
      page: 1,
      pageSize: 10,
      title: '',
      searchData: {
        privateType: '1', //接收1，已发送0
        queryType: '',//通知0，私信1
        type: '',//已读0，1未读
      },
      newsType: '',
      isReply: true,
      selectedRow: [],
    }
  },
  mounted() {
    this.$store.commit('getUserInfo')
    // this.getPages()
    this.searchData.queryType = this.$route.params.queryType
  },
  watch: {
    searchData: {
      handler() {
        this.getPages()
      },
      deep: true
    },
    $route(to) {
      this.searchData.queryType = to.params.queryType
    }
  },
  methods: {
    currentChange() {
      console.log('currentChange')
    },
    selectRow(val) {
      this.selectedRow = []
      val.forEach(item => {
        this.selectedRow.push(item)
      })
    },
    view() {
      if (this.selectedRow.length === 1) {
        let id = this.selectedRow[0].id
        let data = {type: '1', list: id}
        this.$router.push(`/newsContent/${id}`)
        this.saveReceiveTime(data)
      } else {this.$message.error('请选择一行数据')}
    },
    search() {
      this.getPages(this.title)
    },
    remarkRead() {
      let ids = []
      if (this.selectedRow.length >= 1) {
        this.selectedRow.forEach(item => {
          if (item.type === '1') {ids.push(item.id)}
        })
        let data = {type: '0', list: ids.join(',')}
        this.saveReceiveTime(data)
      } else {this.$message.error('请至少选择一行数据')}
    },
    remarkAllRead() {
      let data = {type: '0', queryType: this.searchData.queryType, isAll: true}
      this.saveReceiveTime(data)
    },
    reply() {},
    getPages(title) {
      let toUserId
      let fromUserId
      if (this.searchData.privateType === '0') {
        fromUserId = this.$store.state.userInfo.id
        toUserId = ''
      } else if (this.searchData.privateType === '1') {
        toUserId = this.$store.state.userInfo.id
        fromUserId = ''
      }
      let privateType = this.searchData.queryType === '0' ? '' : this.searchData.privateType
      this.axios.get('/messages/page', {
        params: {
          type: this.searchData.type,
          queryType: this.searchData.queryType,
          toUserId,
          privateType,
          title,
          fromUserId
        }
      })
          .then(res => {
            if (res.data.code.toString() === '200') {
              this.tableDatas = res.data
            } else {this.$message.error(res.data.msg)}
          })
          .catch()
    },
    saveReceiveTime(data) {
      this.axios.post('/messages/saveReceiveTime', Qs.stringify({...data}))
          .then(res => {
            if (res.data.code.toString() === '200') {
              this.getPages()
            } else {this.$message.error(res.data.msg)}
          })
          .catch()
    }
  },
}
</script>

<style scoped lang='scss'>
.newsList-wrap {
  padding: 20px;

  > .searchForm {
    > .input {
      width: 150px;
    }
  }

  > .buttons {
    margin-bottom: 5px;
  }

  > .tab {
    &::v-deep {
      .el-tabs__header {
        margin-bottom: 0
      }

      .el-tabs__nav-wrap::after {
        height: 0;
      }
    }
  }

}
</style>