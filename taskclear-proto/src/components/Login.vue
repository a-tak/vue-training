<template>
    <div id="home">
        <h1 class="title">{{ value }}</h1>
        <v-btn @click="googleLogin">Googleアカウントでログイン</v-btn>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import firebase from "firebase";

@Component
export default class Login extends Vue {

    value: string = "Welcome to MyMarkdown";

    googleLogin() : void {
        firebase
            .auth()
            .signInWithRedirect(new firebase.auth.GoogleAuthProvider());
    }
}
</script>
