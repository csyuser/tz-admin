import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login'
import NavMenu from '@/views/NavMenu'
import HomePage from '@/views/HomePage'
import UserManage from '@/views/permission/UserManage'
import PostManage from '@/views/permission/PostManage'
import MenuManage from '@/views/permission/MenuManage'
import Staff from '@/views/permission/Staff'
import Department from '@/views/permission/Department'
import Group from '@/views/permission/Group'
import Permission from '@/views/permission/Permission'
import NewsList from '@/components/homePage/news/NewsList'
import NewsContent from '@/components/homePage/news/NewsContent'
import NewsReply from '@/components/homePage/news/NewsReply'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/navMenu',
    name: 'NavMenu',
    component: NavMenu,
    children:[
      {
        path: '/HomePage',
        name: 'HomePage',
        component: HomePage,
      }, {
        path: '/UserManage',
        name: 'UserManage',
        component: UserManage,
      },{
        path: '/PostManage',
        name: 'PostManage',
        component: PostManage,
      }, {
        path: '/MenuManage',
        name: 'MenuManage',
        component: MenuManage,
      },{
        path: '/Staff',
        name: 'Staff',
        component: Staff,
      },{
        path: '/Department',
        name: 'Department',
        component: Department,
      }, {
        path: '/Group',
        name: 'Group',
        component: Group,
      },{
        path: '/Permission',
        name: 'Permission',
        component: Permission,
      },{
        path: '/NewsList/:queryType',
        name: 'NewsList',
        component: NewsList,
      },{
        path: '/NewsContent/:newsId',
        name: 'NewsContent',
        component: NewsContent,
      },{
        path: '/NewsReply/:contentId',
        name: 'NewsReply',
        component: NewsReply,
      },],
  },

  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
