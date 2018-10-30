<template>
    <div id="tasklist">
        <v-content>
            <v-btn @click="logout">ログアウト</v-btn>
            <NewTask></NewTask>
        </v-content>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import firebase from "firebase"
import NewTask from "@/components/NewTask.vue"

@Component({
  components: {
    NewTask
  },
})

export default class TaskList extends Vue {
    logout() : void {
        firebase.auth().signOut();
    }
}
</script>
