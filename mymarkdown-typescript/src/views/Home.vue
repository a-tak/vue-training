<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <Login v-if="!isLogin"></Login>
    <Editor v-if="isLogin" :user="userData"></Editor>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Login from "@/components/Login.vue"
import Editor from "@/components/Editor.vue"
import firebase from "firebase"

@Component({
  components: {
    Login,
    Editor
  },
})
export default class Home extends Vue {
  isLogin: boolean = false;
  //anyかnullが入る定義。firebaseのカーソルオーバーして定義確認した。
  userData: any | null = null;

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
