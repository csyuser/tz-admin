<template>
  <div class="content-wrap">
    <div class="title-wrap">
      <div class="buttons">
        <el-button size="small" type="primary" plain @click="reply">
          <i class="el-icon-back"></i>
          返回
        </el-button>
        <el-button size="small" type="primary" plain @click="reply">
          <i class="el-icon-chat-line-round"></i>
          回复
        </el-button>
      </div>
        <h2 class="title">{{ newsContent.title }}</h2>
      <ul class="notes">
        <li><span>发件人：</span><span>{{ newsContent['fromUserName'] }}</span></li>
        <li><span>发送时间：</span><span>{{ formatTime(newsContent['createTime']) }}</span></li>
      </ul>
    </div>
    <section>
      {{ newsContent['content'] }}
    </section>
  </div>
</template>

<script>
import {helper} from '@/views/method'

export default {
  name: 'NewsContent',
  data() {
    return {
      newsId: '',
      newsContent: {}
    }
  },
  mounted() {
    this.newsId = this.$route.params.newsId
    this.getNewsContent()
  },
  methods: {
    getNewsContent() {
      this.axios.get('/messages/selectMessageById', {params: {id: this.newsId}})
          .then(res => {
            if (res.data.code.toString() === '200') {
              this.newsContent = res.data.data
            } else {this.$message.error(res.data.msg)}
          })
          .catch()
    },
    formatTime(val) {
      return helper.formatTime(val)
    },
    reply() {
      this.$router.push(`/NewsReply/${this.newsId}`)
    }
  }
}
</script>

<style scoped lang='scss'>
.content-wrap {
  color: #666666;
  padding: 20px;
  overflow: auto;

  > .title-wrap {
    > .buttons{
      margin-bottom: 15px;
    }

    > .title {
      font-size: 20px;
      margin-right: 2em;
      margin-bottom: 10px;
    }

    > ul {
      display: flex;
      font-size: 12px;
      color: #858585;
      margin-bottom: 10px;

      > li {
        margin-right: 2em;
      }
    }
  }

  section {
    text-indent: 2em;
    line-height: 2em;
  }
}
</style>