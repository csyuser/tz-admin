const socket = {
  getSocket(userId,wsUrl){
    return new Promise((resolve)=>{
      let socket
      if (typeof (WebSocket) == 'undefined') {
        console.log('你不配')
      } else {
        console.log('支持WebSocket')
        let socketUrl = wsUrl + '/websocket/' + userId
        console.log(socketUrl)
        if (socket != null) {
          socket.close()
          socket = null
        }
        socket = new WebSocket(socketUrl)
        //打开事件
        socket.onopen = function () {
          let sendMsg = {toUserId:userId,content: "reload"}
          socket.send(JSON.stringify(sendMsg));
        }
        //获得消息事件
        socket.onmessage = function (data) {
          console.log('data')
          console.log(JSON.parse(data.data))
          resolve(JSON.parse(data.data))
        }
        socket.onclose = function () {
          console.log('websocket已关闭')
        }
        //发生了错误事件
        socket.onerror = function () {
          console.log('websocket发生了错误')
        }
      }
    })

  }
}
export {socket}