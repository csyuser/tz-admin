<template>
  <div class="socket-wrap">
    <el-popover
        placement="bottom"
        trigger="click">
      <section class="message-wrap" v-if="newsType==='notification'">
        <div class="title">通知</div>
        <ul class="contentList">
          <li @click="goMessage">消息1消息1消息1消息1消息1消息1消息1消息1消息1消息1消息1消息1消息1消息1消息1消息1消息1消息1消息1消息1消息1消息1</li>
          <li>消息2</li>
          <li>消息1</li>
          <li>消息2</li>
          <li>消息1</li>
          <li>消息2</li>
          <li>消息1</li>
          <li>消息2</li>
          <li>消息1</li>
          <li>消息2</li>
          <li>消息1</li>
          <li>消息2</li>
        </ul>
        <a class="dropDown" @click="goMessage">查看全部通知</a>
      </section>
      <section class="message-wrap" v-if="newsType==='chat'">
        <div class="title">私信</div>
        <ul class="contentList">
          <li @click="goMessage">消息1消息1消息1消息1消息1消息1消息1消息1消息1消息1消息1消息1消息1消息1消息1消息1消息1消息1消息1消息1消息1消息1</li>
          <li>消息2</li>
          <li>消息1</li>
          <li>消息2</li>
          <li>消息1</li>
          <li>消息2</li>
          <li>消息1</li>
          <li>消息2</li>
          <li>消息1</li>
          <li>消息2</li>
          <li>消息1</li>
          <li>消息2</li>
        </ul>
        <a class="dropDown" @click="goMessage">查看全部通知</a>
      </section>
      <el-badge slot="reference" :value="newsCount" :max="max" class="item">
        <i :class="iconName"></i>
      </el-badge>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'Socket',
  props: {
    iconName: {
      type: String,
      required: true,
    },
    newsType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      newsCount: 10,
      max: 99,
      userId: '1'
    }
  },
  mounted() {
    this.getSocket()

  },
  methods: {
    goMessage() {
      if (this.$route.path !== `/newsList/${this.newsType}`) this.$router.push(`/newsList/${this.newsType}`)
      this.$emit('update:pageHeader', {name: '消息中心'})
    },
    getSocket() {
      let socket
      if (typeof (WebSocket) == 'undefined') {
        console.log('你不配')
      } else {
        console.log('支持WebSocket')
        let socketUrl = this.wsUrl + '/websocket/' + this.userId
        console.log(socketUrl)
        if (socket != null) {
          socket.close()
          socket = null
        }
        socket = new WebSocket(socketUrl)
        //打开事件
        socket.onopen = function () {
          console.log('websocket已打开')
          //socket.send("这是来自客户端的消息" + location.href + new Date());
        }
        //获得消息事件
        socket.onmessage = function (data) {
          console.log('data')
          console.log(JSON.parse(data.data))
        }
        socket.onclose = function () {
          console.log('websocket已关闭')
        }
        //发生了错误事件
        socket.onerror = function () {
          console.log('websocket发生了错误')
        }
      }
    },
    getUnreadCount(){

    }
  }
}
</script>

<style scoped lang='scss'>
.socket-wrap {
  i {
    font-size: 1.3em;
    color: rgb(165, 165, 165);
  }

  &:hover {
    cursor: pointer;
  }

}

.message-wrap {
  width: 340px;
  margin: -12px;

  > .title {
    padding: 10px 16px;
    background: #f9f9f9;
    border-bottom: 1px solid #ddd;
  }

  > ul {
    margin: 0 5px;
    max-height: 350px;
    overflow: auto;

    > li {
      padding: 15px;
      border-bottom: 1px solid #ebebeb;
      line-height: 1.5em;
      cursor: pointer;

      &:hover {
        background: #f9f9f9;
      }
    }
  }

  > .dropDown {
    cursor: pointer;
    width: 100%;
    display: inline-block;
    background: #f9f9f9;
    padding: 10px 16px;
    text-align: center;
  }
}
</style>