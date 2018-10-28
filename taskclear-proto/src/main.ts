import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css';
import firebase from 'firebase'

Vue.config.productionTip = false

var config = {
  apiKey: "AIzaSyA94oovqbFPrXWWfeoUwZbJX65JfSiYh7c",
  authDomain: "a-tak-test.firebaseapp.com",
  databaseURL: "https://a-tak-test.firebaseio.com",
  projectId: "a-tak-test",
  storageBucket: "a-tak-test.appspot.com",
  messagingSenderId: "190278648588"
};
firebase.initializeApp(config);

Vue.use(Vuetify)

const firestore = firebase.firestore();
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
