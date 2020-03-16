import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

import Login from './components/Login.vue'
import Hall from './components/hall.vue'
import hallList from './components/hallList.vue'
import Paint from './components/paintRoom.vue'

export default new Router({
  routes: [
    { path:'/', component: Login, meta: { title: '登录' } },
    { path:'/hall', component: Hall, meta: { title: '大厅' },
      children: [ 
        { path:'/', component:hallList },
        { path: '/paint', component: Paint, meta: '画室' } 
      ] 
    },
    
  ]
})