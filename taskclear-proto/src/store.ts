import Vue from 'vue'
import Vuex from 'vuex'
import task from './task';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //タスク一覧の配列 一応初期化しているけど意味なし。型固定されない
    tasks:[new task()],
    //認証ユーザー情報
    user: null,
    //タスク表示日付 コストラクタが簡単なヤツはこれで初期化して型決定できるんだけどなぁ
    targetDate: new Date(),
  },
  getters: {
    tasks(state) { return state.tasks },
    user(state) { return state.user},
    targetDate(state) { return state.targetDate},
  },
  mutations: {
    addTask(state, task) {
      state.tasks.push(task);
      console.log(state.tasks);
    },
    deleteTask(state, index: number) {
      state.tasks.splice(index,1);
    },
    setTasks(state, tasks:[]) {
      state.tasks = tasks;
    },
    setUser(state, user) {
      state.user = user;
    },
    setTargetDate(state,date: Date) {
      state.targetDate = date;
    },
  },
  actions: {

  }
})
