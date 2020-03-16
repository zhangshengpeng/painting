import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'

import VueSocketio from 'vue-socket.io';


import store from '../store/index.js'
import Vuex from 'vuex'
Vue.use(Vuex)

Vue.use(new VueSocketio({
  debug: false,
  connection: 'wss://www.bixiaohe.fun' //地址+端口，由后端提供
}));

//axios允许携带cookie
axios.defaults.withCredentials = true;
Vue.prototype.$axios = axios

Vue.use(Element);
import App from './App.vue'
import router from './router'


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
