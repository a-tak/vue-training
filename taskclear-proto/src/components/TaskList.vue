<template>
    <div id="tasklist">
        <v-layout>
            <v-flex xs12 sm6 md4>
                <v-menu
                    :close-on-content-click="false"
                    v-model="menu2"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                >
                    <v-text-field
                    slot="activator"
                    v-model="targetDate"
                    label="日付を選択してください"
                    prepend-icon="event"
                    readonly
                    ></v-text-field>
                    <v-date-picker v-model="targetDate" @input="menu2 = false" locale="jp"></v-date-picker>
                </v-menu>
                </v-flex>
            <v-flex>
                <v-btn @click="logout">ログアウト</v-btn>
            </v-flex>
        </v-layout>
        <v-layout>
            <v-flex>
                <NewTask></NewTask>
            </v-flex>
        </v-layout>
        <v-layout row>
            <v-flex xs12 sm6 offset-sm1>
                <v-card>
                    <v-list>
                        <v-list-tile v-for="item in tasks" :key="item.id" @click="">
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

    get tasks() {
        return this.$store.getters.tasks;
    }
    
    get targetDate() {
      return this.$store.getters.targetDate.toISOString().substr(0, 10)
    }

    set targetDate(value) {
        this.$store.commit("setTargetDate",new Date(value));
    }

    private menu2_: boolean = false;

    get menu2() {
        return this.menu2_;
    }

    set menu2(value) {
        this.menu2_ = value;
    }

    created() : void {
        firebase
        .firestore()
        .collection("tasks")
//        .where("date","==",this.$store.getters.targetDate)
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
}
</script>
