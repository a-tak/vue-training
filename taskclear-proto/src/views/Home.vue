<template>
  <div id="Home">
    <Login v-if="!isLogin"></Login>
    <TaskList v-if="isLogin"></TaskList>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Login from "@/components/Login.vue"
import TaskList from "@/components/TaskList.vue"
import firebase from "firebase"

@Component({
  components: {
    Login,
    TaskList
  },
})
export default class Home extends Vue {
    isLogin: boolean = false;
  userData: firebase.User | null = null;

  created () : void {
    firebase.auth().onAuthStateChanged(user => {
    console.log(user);
    if (user) {
      console.log("Login!");
      this.isLogin = true;
      this.$store.commit("setUser",user);
      this.userData = user;
    }else{
      this.isLogin = false;
      this.$store.commit("setUser",null);
      this.userData = null;
    };
  });
  }
}
</script>
