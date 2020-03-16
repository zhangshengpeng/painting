import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";

//axios允许携带cookie
axios.defaults.withCredentials = true;
Vue.prototype.$axios = axios

const store = ()=>{
  return new Vuex.Store({
    strict: false,
    state: () => ({
      user: {}
    }),
    mutations: {
      setInfo(state,res){
        state.user = res
      }
    },
    actions: {
      async getInfo(context) {
        let response = await axios.get('https://www.bixiaohe.fun/user-info')
        context.commit('setInfo',response.data)
        return response
      },
      async setHistory(context, params) {
        let response = await axios.post('https://www.bixiaohe.fun/set-game', params)
        return response
      },
      async getHistory(context, params) {
        let response = await axios.post('https://www.bixiaohe.fun/get-game', params)
        return response.data
      }
    }
  })
};

export default store