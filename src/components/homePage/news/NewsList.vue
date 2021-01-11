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
      <el-button size="small" class="update" @click="remarkRead">
        <i class="el-icon-check"></i>
        标为已读
      </el-button>
      <el-button size="small" class="update" @click="remarkAllRead">
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
               @currentChange="currentChange" @postSelect="selectRow" @dblclick="view('double')" :is-news="true">
        </Table>
      </el-tab-pane>
      <el-tab-pane label="已发消息" name="0">
        <Table class="table" :colsHead="colsHead" :tableDatas="tableDatas" :pageSize="pageSize" :page="page"
               :need-button="false"
               @currentChange="currentChange" @postSelect="selectRow" @dblclick="view('double')" :is-news="true">
        </Table>
      </el-tab-pane>
    </el-tabs>
    <Table class="table" :colsHead="colsHead" :tableDatas="tableDatas" :pageSize="pageSize" :page="page"
           :need-button="false" v-if="searchData.queryType === '0'"
           @currentChange="currentChange" @postSelect="selectRow" @dblclick="view('double')" :is-news="true">
    </Table>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%">
      <NewsDialog></NewsDialog>
      <span slot="footer" class="dialog-footer">
  </span>
    </el-dialog>
  </div>
</template>

<script>
import Table from '@/components/permission/Table'
import NewsDialog from '@/components/homePage/news/NewsDialog'
import Qs from 'qs'

export default {
  name: 'NewsList',
  components: {Table, NewsDialog},
  data() {
    return {
      colsHead: [{prop: 'title', label: '标题'}, {prop: 'fromUserName', label: '发送人'}, {prop: 'type', label: '状态'}, {
        prop: 'createTime',
        label: '接收时间'
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
      dialogVisible: false,
      dialogTitle: '',
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
        console.log('执行了')
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
    view(type) {
      this.dialogTitle = '查看信息详情'
      if (type !== 'double' && this.selectedRow.length === 1) {
        this.dialogVisible = true
      } else if (type === 'double') {
        this.dialogVisible = true
      } else {this.$message.error('请选择一行数据')}
    },
    search() {
      this.getPages(this.title)
    },
    remarkRead() {
      let ids = []
      if (this.selectedRow.length >= 1) {
        console.log('选择的行数据')
        console.log(this.selectedRow)
        this.selectedRow.forEach(item => {
          console.log('遍历选择的行')
          console.log(item)
          if (item.type === '1') {ids.push(item.id)}
        })
        let data = {type:'0',list:JSON.stringify(ids)}
        this.saveReceiveTime(data)
      } else {this.$message.error('请至少选择一行数据')}
    },
    remarkAllRead() {this.saveReceiveTime('0', [], this.searchData.queryType, true)},
    reply() {},
    getPages(title) {
      let privateType = this.searchData.queryType === '0' ? '' : this.searchData.privateType
      this.axios.get('/messages/page', {
        params: {
          toUserId: this.$store.state.userInfo.id,
          type: this.searchData.type,
          privateType,
          queryType: this.searchData.queryType,
          title,
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
      // let obj = {type, list, queryType, isAll}
      //
      // console.log('type')
      // console.log(obj)
      this.axios.post('/messages/saveReceiveTime', Qs.stringify({...data}))
          .then(res => {
            if (res.data.code.toString() === '200') {
              console.log(res)
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
        height: 0px;
      }
    }
  }

}
</style>