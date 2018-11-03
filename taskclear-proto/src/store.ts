import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tasks:[
      //{}でキーみたいなのを設定しているのはオブジェクトリテラルというもの。JSONも同じだな。
      {},
    ],
    user: null,
  },
  getters: {
    tasks(state) { return state.tasks },
    user(state) { return state.user}
  },
  mutations: {
    addTask(state, task) {
      state.tasks.push(task);
      console.log(state.tasks);
    },
    setTasks(state, tasks) {
      state.tasks = tasks;
    },
    setUser(state, user) {
      state.user = user;
    }
  },
  actions: {

  }
})
