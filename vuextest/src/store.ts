import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    username : ""
  },
  mutations: {
    //デフォでstateやpayload(commitの時の引数)が渡されるらしい
    increment(state, payload) {
        state.count++
    },
    setcount(state, payload) {
        state.count = payload
    },
    setName(state, payload) {
        state.username = payload
    }
  },
  actions: {
    //名前の頭にアスタリスクを着けて返すaction
    setName({ commit }, payload) {
        let newname : string = payload;
        newname = '*' + newname;
        commit('setName',newname)
    }
  },
  getters: {
      //このstateは引数?後ろのgettersは何?
      count(state, getters, rootState, rootGetter) {
          return state.count;
      },
      username(state) {
          return state.username;
      }
  }
})
