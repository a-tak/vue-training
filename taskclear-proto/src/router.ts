import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import TaskList from './components/TaskList.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/tasklist',
      name: 'tasklist',
      component: TaskList
    },
  ]
})
