import Vue from 'vue'
import Vuex from 'vuex'
import ITask from './ITask';
import Firebase from 'firebase';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //タスク一覧の配列 型指定するにはどうすれば…
    tasks: [{}],
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
    addTask(state, task:ITask) {
      state.tasks.push(task);
      console.log(state.tasks);
    },
    deleteTask(state, index: number) {
      state.tasks.splice(index,1);
    },
    setTasks(state, tasks:ITask[]) {
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
