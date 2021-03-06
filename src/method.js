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
    if (val === '1') {return '未读'} else if (val === '0') {return '已读'}
  },
  roleType(val){
    if (val === '1') {return '普通岗位'} else if (val === '0') {return '管理岗位'}
  },
  menuType(val){
    if (val === '0') {return '一级菜单'} else if (val === '1') {return '页面菜单'}else if (val === '2') {return '页面功能'}
  }
}

export {helper}