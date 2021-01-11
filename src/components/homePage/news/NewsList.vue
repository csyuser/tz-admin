<template>
  <div class="newsList-wrap">{{ newsType }}
    <el-form :inline="true" :model="searchData" class="demo-form-inline searchForm">
      <el-form-item class="input">
        <el-input v-model="searchData.title" placeholder="输入标题" size="small" suffix-icon="xxx"></el-input>
      </el-form-item>
      <el-form-item class="input">
        <el-select v-model="searchData['shot']" placeholder="消息状态" clearable size="small">
          <el-option label="已读" value="0"></el-option>
          <el-option label="未读" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="input">
        <el-select v-model="searchData['type']" placeholder="消息分类" clearable size="small">
          <el-option label="全部" value="all"></el-option>
          <el-option label="接收" value="received"></el-option>
          <el-option label="已发送" value="send"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" size="small">查询</el-button>
      </el-form-item>
    </el-form>
    <Table class="table" :colsHead="colsHead" :tableDatas="tableDatas" :pageSize="pageSize" :page="page"
           :need-button="false"
           @currentChange="currentChange" @postSelect="selectRow" @dblclick="view('double')" :is-news="true">
      <template #newsButton>
        <div class="buttons">
          <el-button size="small" class="update" type="primary" v-if="$route.params.newsType === 'chat'">
            <i class="el-icon-plus"></i>
            新建
          </el-button>
          <el-button size="small" class="update" type="primary" @click="view">
            <i class="el-icon-reading"></i>
            查看详情
          </el-button>
          <el-button size="small" class="update" @click="relatedPost">
            <i class="el-icon-check"></i>
            标为已读
          </el-button>
          <el-button size="small" class="update" @click="relatedPost">
            <i class="el-icon-check"></i>
            全部标为已读
          </el-button>
          <el-button size="small" class="update" @click="relatedPost"
                     v-if="$route.params.newsType === 'chat' && isReply">
            <i class="el-icon-chat-line-round"></i>
            回复
          </el-button>
        </div>
      </template>
    </Table>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%">
      <NewsDialog></NewsDialog>
      <span slot="footer" class="dialog-footer">
<!--    <el-button @click="dialogVisible = false">取 消</el-button>-->
<!--    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
  </span>
    </el-dialog>
  </div>
</template>

<script>
import Table from '@/components/permission/Table'
import NewsDialog from '@/components/homePage/news/NewsDialog'

export default {
  name: 'NewsList',
  components: {Table, NewsDialog},
  data() {
    return {
      colsHead: [{prop: 'title', label: '标题'}, {prop: 'name', label: '发送人'}, {prop: 'type', label: '状态'},{prop: 'shot', label: '分类'}],
      tableDatas: [{name: '管理员1', type: '已读', title: '标题1', id: '1',shot:'已发送'}, {name: '管理员2', type: '已读', title: '标题2', id: '2',shot:'已发送'},
        {name: '管理员3', type: '已读', title: '标题3', id: '3',shot:'接收'},],
      page: 1,
      pageSize: 10,
      searchData: {},
      newsType: '',
      isReply: true,
      selectedRow: [],
      dialogVisible: false,
      dialogTitle: ''
    }
  },
  methods: {
    currentChange() {
      console.log('currentChange')
    },
    selectRow(val) {
      console.log('selectRow')
      this.selectedRow = []
      val.forEach(item => {
        this.selectedRow.push(item)
      })
      console.log(this.selectedRow)
    },
    view(type) {
      this.dialogTitle = '查看信息详情'
      if (type !=='double' && this.selectedRow.length===1){
        this.dialogVisible = true
        console.log(this.selectedRow[0].id)
      }else if (type ==='double') {
        this.dialogVisible = true
      }else {this.$message.error('请选择一行数据')}
    },
    relatedPost() {
      console.log('relatedPost')
    },
    search() {
      console.log('查询消息')
    },
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

  > .table {
    > .buttons {
      margin-bottom: 10px;
    }
  }
}
</style>