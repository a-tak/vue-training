<template>
    <div id="home">
        <h1 class="title">{{ msg }}</h1>
        <v-btn @click="googleLogin">Googleアカウントでログイン</v-btn>
    </div>
</template>
<script>
import firebase from "firebase"

export default {
    name: "home",
    data() {
        return {
            msg: "Welcome to MyMarkdown"
        };
    },
    methods: {
        googleLogin: function() {
            firebase
                .auth()
                .signInWithRedirect(new firebase.auth.GoogleAuthProvider());
        }
    }
};
</script>
