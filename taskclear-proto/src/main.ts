import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css';
import firebase from 'firebase'

Vue.config.productionTip = false

console.log("env=" + process.env.VUE_APP_PROJECT_ID);
if (process != undefined &&　process.env != undefined) {
  var config = {
    apiKey: process.env.VUE_APP_API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.VUE_APP_DATABASE_URL,
    projectId: process.env.VUE_APP_PROJECT_ID,
    storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.VUE_APP_MESSAGING_SENDERID,
  };
firebase.initializeApp(config);
}

Vue.use(Vuetify)

const firestore = firebase.firestore();
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
