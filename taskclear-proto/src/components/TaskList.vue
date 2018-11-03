<template>
    <div id="tasklist">
        <v-layout>
            <v-flex>
                <v-btn @click="logout">ログアウト</v-btn>
                <NewTask></NewTask>
            </v-flex>
        </v-layout>
        <v-layout row>
            <v-flex xs12 sm6 offset-sm1>
                <v-card>
                    <v-list>
                        <v-list-tile v-for="item in tasks" :key="item.title" @click="">
                            <v-list-tile-content>
                                <v-list-tile-title v-html="item.title"></v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-card>
            </v-flex>
        </v-layout>   
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

    tasksArray: { id: string, title: string} = {id: "", title: ""};

    created() : void {
        firebase
        .firestore()
        .collection("tasks")
        .doc(this.$store.getters.user.uid)
        .get()
        .then(doc => {
            if (doc.exists && doc.data()!.tasks ) {
                //どうしても!で無視しないと通らなかった。手前でundefinedチェックしても駄目。
                this.$store.commit("setTasks", doc.data()!.tasks);
                console.log("tasks=" + doc.data()!.tasks);
            }else{
                console.log("tasks not found");
            }
        });
    }

    logout() : void {
        firebase.auth().signOut();
    }

    get tasks() {
        return this.$store.getters.tasks;
    }
    
}
</script>
