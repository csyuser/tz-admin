<template>
  <div class="message-wrap">
    <section class="title">
      <h1>通知</h1>
      <div class="search">
        <el-input class="nameSearch" size="small" v-model="listInfo.name" placeholder="搜索通知">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-select class="typeSearch" v-model="listInfo.type" placeholder="消息类型" size="small">
          <el-option label="全选" value=""></el-option>
          <el-option label="已读" value="0"></el-option>
          <el-option label="未读" value="1"></el-option>
        </el-select>
      </div>
    </section>
    <ul>
      <li v-for="message in messagesList" :key="message.id" @click="markRead(message.id)"
          :class="{markRead:message['receiveTime']}">
        <span><SvgIcon :icon-name="message['receiveTime']?'':'message'"></SvgIcon>{{ message.content }}</span>
        <span>{{ beautyTime(message['createTime']) }}</span>
      </li>
    </ul>
    <el-pagination class="pagination" layout="prev, pager, next,total" :page-size="listInfo.pageSize" :total="count"
                   @current-change="currentChange"
                   :current-page="listInfo.page">
    </el-pagination>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
import dayjs from 'dayjs'

export default {
  name: 'Message',
  components: {SvgIcon},
  data() {
    return {
      listInfo: {
        page: 1,
        name: '',
        pageSize: 10,
        type: ''
      },
      count: null,
      messagesList: []
    }
  },
  watch: {
    listInfo: {
      handler(newVal) {
        this.getListPage(newVal)
      },
      immediate: true,
      deep: true
    },
  },
  mounted() {
    this.getListPage(this.listInfo)
  },
  methods: {
    beautyTime(string) {
      return dayjs(string).format('YYYY-M-D H:mm')
    },
    getListPage(info) {
      const pageLoading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.5)'
      })
      setTimeout(() => {
        pageLoading.close()
      }, 5000)
      this.axios.get('/messages/page', {
        params: {...info}
      }).then((res) => {
        pageLoading.close()
        if (res.data.code.toString() === '200') {
          console.log(res)
          this.count = res.data.count
          this.messagesList = res.data.data
        } else {this.$message.error(res.data.msg)}
      })
          .catch(() => {pageLoading.close()})
    },
    currentChange(current) {
      this.listInfo.currentPage = current
    },
    markRead(messageId) {
      console.log(messageId)
    }
  }
}
</script>

<style scoped lang='scss'>
.message-wrap {
  margin: 20px 40px 0;

  > .title{
    display: flex;
    justify-content: space-between;
    > h1 {
      font-size: 24px;
    }
    > .search {
      > .typeSearch {
        width: 105px;
        margin-left: 15px;
      }

      > .nameSearch {
        width: 200px;
        margin-left: 15px;
      }
    }
  }


  > ul {
    margin-top: 25px;

    > li {
      &.markRead {
        color: #949494;
      }

      svg {
        margin-right: 0.3em;
        margin-left: -1em;
      }

      padding: 8px 20px;
      border-bottom: 1px solid #f3f3f3;
      display: flex;
      justify-content: space-between;
    }
  }

  > .pagination {
    margin: 32px 0;
  }
}
</style>