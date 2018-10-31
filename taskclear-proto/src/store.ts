import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tasks:[]
  },
  mutations: {
    addTask(state, task:string) {
      //なぜかビルドはエラーになるが動いている。配列に追加するにはどうすれば良いか?
      state.tasks.push(task);
      console.log(state.tasks);
    }
  },
  actions: {

  }
})
