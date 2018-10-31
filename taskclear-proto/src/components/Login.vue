<template>
    <div id="home">
        <v-container>
            <v-layout align-center justify-center row fill-height>
                <v-flex>
                    <v-btn @click="googleLogin">Googleアカウントでログイン</v-btn>
                </v-flex>
            </v-layout>
        </v-container>
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
