import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login'
import NavMenu from '@/views/NavMenu'
import Test from '@/views/Test'
import HomePage from '@/views/HomePage'

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
      },
      {
        path: '/Test',
        name: 'Test',
        component: Test,
      },
      {
        path: '/1-1',
        name: 'Test',
        component: Test,
      }
    ],
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
