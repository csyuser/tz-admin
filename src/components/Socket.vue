<template>
  <div class="socket-wrap">
<!--    <el-button @click="xxx">点我</el-button>-->
    <el-popover
        placement="bottom"
        trigger="click">
      <section class="message-wrap">
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
      <el-badge slot="reference" :value="newsCount" :max="max" class="item">
        <i class="el-icon-bell"></i>
      </el-badge>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'Socket',
  data() {
    return {
      newsCount: 10,
      max: 99,
      userId: '1'
    }
  },
  mounted() {
    let socket
    if (typeof (WebSocket) == 'undefined') {
      console.log('你不配')
    } else {
      console.log('支持WebSocket')
      let socketUrl = 'ws://192.168.99.132:8080/topcheer/websocket/' + this.userId
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
        console.log(data)
        // let msg = data.data;
        // //&分隔标题和内容
        // let msgAry = msg.split("&");
        // let title = msgAry[0];
        // let content = msgAry[1];
        // console.log("标题" + title)
        // console.log("内容" + content)
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
  methods:{
    goMessage(){
      if (this.$route.path !== '/Message') this.$router.push('/Message')
      this.$emit('update:pageHeader',{name:'消息中心'})
    },
    // xxx(){
    //   this.axios.get('websocket/websocketSend')
    //   .then()
    //   .catch()
    // }
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
    > li{
      padding: 15px;
      border-bottom: 1px solid #ebebeb;
      line-height: 1.5em;
      cursor: pointer;
      &:hover{
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