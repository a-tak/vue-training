import Vue from 'vue'
import Vuex from 'vuex'
import Task from './lib/Task';
import TaskController from './lib/TaskController';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    taskCtrl: new TaskController(),
    //認証ユーザー情報
    user: null,
    //タスク表示日付 コストラクタが簡単なヤツはこれで初期化して型決定できるんだけどなぁ
    targetDate: new Date(),
  },
  getters: {
    taskCtrl(state) { return state.taskCtrl },
    user(state) { return state.user},
    targetDate(state) { return state.targetDate},
  },
  mutations: {
    addTask(state, task:Task) {
      state.taskCtrl.tasks.push(task);
    },
    deleteTask(state, index: number) {
      state.taskCtrl.tasks.splice(index,1);
    },
    setTaskCtrl(state, taskCtrl:TaskController) {
      console.log("setTaskCtrl =" + taskCtrl);
      console.log("setTaskCtrl count=" + taskCtrl.tasks.length);
      state.taskCtrl = taskCtrl;
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
