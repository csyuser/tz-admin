import dayjs from 'dayjs'
const helper = {
  selection(val) {
    if (val === '1') {return '选用'} else if (val === '0') {return '禁用'}
  },
  gender(val){
    if (val === '0') {return '女'} else if (val === '1') {return '男'}
  },
  userStatus(level) {
    if (level === '1') {return '正常'} else if (level === '2') {return '锁定'} else if (level === '3') {return '注销'}
  },
  riskLevel(level) {
    if (level === '1') {return '异地登录'} else if (level === '2') {return '频繁登录'}
  },
  formatTime(string){
    return dayjs(string).format('YYYY-M-D H:mm')
  },
  newsType(val){
    if (val === '0') {return '未读'} else if (val === '1') {return '已读'}
  }
}

export {helper}