<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <Login v-if="!isLogin"></Login>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Login from "@/components/Login.vue"
import firebase from "firebase"

@Component({
  components: {
    Login,
  },
})
export default class Home extends Vue {
    isLogin: boolean = false;
  userData: firebase.User | null = null;

  created () {
    firebase.auth().onAuthStateChanged(user => {
    console.log(user);
    if (user) {
      this.isLogin = true;
      this.userData = user;
    }else{
      this.isLogin = false;
      this.userData = null;
    };
  });
  }
}
</script>
