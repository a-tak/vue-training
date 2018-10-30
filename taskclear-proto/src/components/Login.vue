<template>
    <div id="home">
        <v-btn @click="googleLogin">Googleアカウントでログイン</v-btn>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import firebase from "firebase";

@Component
export default class Login extends Vue {
    
    googleLogin() : void {
        firebase
            .auth()
            .signInWithRedirect(new firebase.auth.GoogleAuthProvider());
    }
}
</script>
