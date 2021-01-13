<template>
  <div class="nav-menu">
    <div class="sidebar-wrap">
      <div class="logo">
        天正管理系统
      </div>
      <el-menu :default-active="$route.path" class="el-menu-vertical-demo sidebar" router unique-opened
               background-color="#304156" text-color="#fff" active-text-color="#409eff">
        <el-menu-item index="/HomePage" @click="selectMenu()">
          <i class="el-icon-menu"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu :index="lists.id" v-for="lists in menuList" :key="lists.id">
          <template slot="title">
            <SvgIcon :icon-name="lists.icon"></SvgIcon>
            <span>{{ lists.name }}</span>
          </template>
          <el-menu-item v-for="list in lists.children" :key="list.id" :index="list.url" @click="selectMenu(list)">
            {{ list.name }}
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div class="right">
      <header>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/HomePage' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item v-for="item in nowBreadcrumb" :key="item">{{ item }}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="news">
          <Socket class="socket" @update:pageHeader="selectMenu" icon-name="el-icon-chat-dot-round" query-type="1"
                  :news-count="socketData.privateCount" :news-list="socketData['privateList']"></Socket>
          <Socket class="socket" @update:pageHeader="selectMenu" icon-name="el-icon-bell" query-type="0"
                  :news-count="socketData.sysCount" :news-list="socketData['sysList']"></Socket>
        </div>
        <el-popover placement="bottom" trigger="click" class="user-wrap">
          <section class="message-content-wrap">
            <div class="title">{{ this.userInfo.name }}</div>
            <ul class="contentList">
              <li @click="logOut">退出登录</li>
            </ul>
            <!--            <p class="dropDown">退出登录</p>-->
          </section>
          <div class="userInfo" slot="reference">
            <el-avatar class="portrait" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg">
              user
            </el-avatar>
            <i class="el-icon-caret-bottom"></i>
          </div>
        </el-popover>
      </header>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
import Socket from '@/components/homePage/news/Socket'
import {socket} from '@/assets/control/socket'

export default {
  name: 'NavMenu',
  components: {SvgIcon, Socket},
  data() {
    return {
      menuList: [],
      userInfo: {},
      privateCount: 0,
      sysCount: 0,
      socketData: {},
      nowBreadcrumb: [],
      breadcrumbList:[]
    }
  },
  async mounted() {
    this.$store.commit('getUserInfo')
    this.$store.commit('fetch')
    this.nowBreadcrumb = this.$store.state.selectedMenu
    this.axios.get('/menu/selectMenuTree')
        .then(res => {
          if (res.data.code.toString() === '200') {
            this.menuList = res.data.data
            this.setBreadcrumb()
          } else {this.menuList = []}
        })
        .catch()
    this.userInfo = this.$store.state.userInfo
    this.socketData = await socket.getSocket(this.$store.state.userInfo.id, this.wsUrl)
  },
  watch: {
    socketData: {
      handler(newVal) {
        this.socketData = newVal
      },
      // immediate: true,
      deep: true
    },
    async '$store.state.isGetSocket'(newVal) {
      if (newVal === true) {
        this.socketData = await socket.getSocket(this.$store.state.userInfo.id, this.wsUrl)
        this.$store.commit('setSocket', false)
      }
    },
    async $route(to) {
      this.socketData = await socket.getSocket(this.$store.state.userInfo.id, this.wsUrl)
      this.breadcrumbList.forEach(item=>{
        if (item.url === to.path){
          this.nowBreadcrumb = item.list
          window.localStorage.setItem('selectedMenu', JSON.stringify(item.list))
        }
      })
    },
  },
  methods: {
    selectMenu(list) {
      console.log(list)
      // this.nowBreadcrumb = []
      // console.log('list')
      // console.log(list)
      // if (list) {
      //   if (list['parentName']) {this.nowBreadcrumb.push(list['parentName'], list.name)} else {this.nowBreadcrumb.push(list.name)}
      // }
      // window.localStorage.setItem('selectedMenu', JSON.stringify(this.nowBreadcrumb))
    },
    logOut() {
      this.axios.get('/logoutUser', {params: {username: this.userInfo.code}})
          .then(res => {
            if (res.data.code.toString() === '200') {
              this.$router.push('/')
              window.localStorage.clear()
            }
          })
          .catch()
    },
    setBreadcrumb() {
      let list = []
      let url = ''
      let breadList = []
      let getBreadList = (val) => {
        val.forEach(item => {
          item['parentName'] && list.push(item['parentName'])
          if (item.children && item.children.length>=1) {
            getBreadList(item.children)
          } else {
            list.push(item.name)
            url = item.url
            breadList.push({list: list, url: url})
            list = []
          }
        })
      }
      getBreadList(this.menuList)
      this.breadcrumbList = breadList
    }
  }
}
</script>

<style scoped lang='scss'>
$headerHeight: 50px;
$sideWidth: 205px;
$mainBlue: #409eff;

.nav-menu {
  display: flex;
  height: 100%;

  > .sidebar-wrap {
    width: $sideWidth;
    height: 100%;
    overflow: hidden;

    > .logo {
      height: $headerHeight;
      background: #304156;
      display: flex;
      justify-content: center;
      align-items: center;
      color: rgb(255, 255, 255);
      font-weight: 600;
    }

    > .sidebar {
      height: calc(100% - #{$headerHeight});
      border-right: none
    }
  }

  > .right {
    width: calc(100% - #{$sideWidth});
    display: flex;
    flex-direction: column;

    > header {
      width: 100%;
      height: calc(#{$headerHeight} + 10px);
      padding: 0 15px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #d8dce5;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);

      > .link {
        &:hover {
          color: $mainBlue;
          cursor: pointer;
        }

        &.unClickable {
          color: #97a8be;
          cursor: default;

          &:hover {
            color: #97a8be;
          }
        }
      }

      > .pathName {
        padding: 0.5em;
        color: #97a8be;
      }

      > .news {
        margin-left: auto;
        display: flex;
        margin-top: 10px;

        > .socket {
          margin-left: 2em;
        }
      }

      > .user-wrap {
        margin-left: 36px;

        &:hover {
          cursor: pointer
        }

      }
    }
  }
}

.userInfo {
  display: flex;
  align-items: center;

  .portrait {
    margin-right: 0.2em;
  }
}

.message-content-wrap {
  width: 150px;
  margin: -12px;

  > .title {
    padding: 8px 16px;
    background: #f9f9f9;
    border-bottom: 1px solid #ddd;
    font-weight: bold;
  }

  > ul {
    margin: 0 5px;
    max-height: 350px;
    overflow: auto;

    > li {
      padding: 8px 16px;
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