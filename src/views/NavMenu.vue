<template>
  <div class="nav-menu">
    <div class="sidebar-wrap">
      <div class="logo">
        天正管理系统
      </div>
      <el-menu default-active="1" class="el-menu-vertical-demo sidebar" @open="handleOpen" @close="handleClose"
               background-color="#304156" text-color="#fff" active-text-color="#409eff">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>导航一</span>
          </template>
          <el-menu-item index="1-2">选项1</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div class="right">
      <header>首页 / 权限管理</header>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavMenu',
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style scoped lang='scss'>
.nav-menu {
  display: flex;
  height: 100%;
  > .sidebar-wrap {
    width: 205px;
    height: 100%;
    overflow: hidden;
    > .logo{
      height: 50px;
      background: #304156;
      display: flex;
      justify-content: center;
      align-items: center;
      color: rgb(255, 255, 255);
      font-weight: 600;
    }
    > .sidebar{
      height: calc(100% - 50px);
      border-right:none
    }
  }

  > .right {
    width: calc(100% - 205px);

    > header {
      width: 100%;
      height: 50px;
      padding-left: 15px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #d8dce5;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);;
    }
  }
}
</style>