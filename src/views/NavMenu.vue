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
            <i class="el-icon-location"></i>
            <span>{{ lists.title }}</span>
          </template>
          <el-menu-item v-for="list in lists.list" :key="list.id" :index="list.path" @click="selectMenu(list)">
            {{ list.menuName }}
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div class="right">
      <header>
        <span class="link" :class="unClickable" @click="toHomePage()">首页
          <!--          <router-link to="/Homepage" class="homeLink" :class="unClickable">首页</router-link>-->
        </span>
        <span class="pathName">{{ selected }}</span></header>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavMenu',
  data() {
    return {
      selected: '',
      menuList: [
        {id: '1', title: '权限管理', icon: '',order:'1',
          list: [{order:'1-1',menuTitle: '权限管理', menuName: '用户管理', id: '1-1', path: '/UserManage'}, {order:'1-2',menuTitle: '权限管理', menuName: '岗位管理', id: '1-2', path: '/PostManage'}, {order:'1-3',menuTitle: '权限管理', menuName: '人员管理', id: '1-3', path: '/Staff'}, {order:'1-4',menuTitle: '权限管理', menuName: '功能菜单管理', id: '1-4', path: '/MenuManage'},{order:'1-5',menuTitle: '权限管理', menuName: '部门管理', id: '1-5', path: '/Department'}]},
        {id: '2', title: '系统工具', icon: '',
          list: [{menuTitle: '系统工具', menuName: '生成代码', id: '2-1', path: '/2-1'}, {menuTitle: '系统工具', menuName: '存储管理', id: '2-2', path: '/2-1'}]
        }
      ]
    }
  },
  mounted() {
    this.$store.commit('fetch')
    this.selected = this.$store.state.selectedMenu
  },
  computed: {
    unClickable() {
      return {unClickable: this.selected === ''}
    }
  },
  methods: {
    selectMenu(list) {
      if (list) {
        this.selected = ' / ' + list.menuTitle + ' / ' + list.menuName
      } else {
        this.selected = ''
      }
      window.localStorage.setItem('selectedMenu', this.selected)
    },
    toHomePage() {
      if (this.selected!=''){
        this.selected = ''
        window.localStorage.setItem('selectedMenu', this.selected)
        this.$router.push('/HomePage')
      }
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

    > header {
      width: 100%;
      height: calc(#{$headerHeight} + 10px);
      padding-left: 15px;
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
    }
  }
}
</style>