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
                    <v-date-picker v-model="targetDate" @input="menu2 = false" locale="jp" ></v-date-picker>
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
                        <v-list-tile v-for="(item, index) in tasks" :key="item.id" @click="">
                            <v-list-tile-action>
                                <v-btn icon ripple @click="startTask(item)" v-if="item.doing === false">
                                    <v-icon color="purple">play_circle_filled</v-icon>
                                </v-btn>
                                <v-btn icon ripple @click="stopTask(item)" v-if="item.doing === true">
                                    <v-icon color="purple">pause_circle_filled</v-icon>
                                </v-btn>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title v-html="item.title">
                                </v-list-tile-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-btn icon ripple @click="deleteTask(index)">
                                    <v-icon color="grey lighten-1">delete</v-icon>
                                </v-btn>
                            </v-list-tile-action>
                        </v-list-tile>
                    </v-list>
                </v-card>
            </v-flex>
        </v-layout>   
    </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import firebase from "firebase"
import NewTask from "@/components/NewTask.vue"
import util from "../util";
import fb from "../firebaseUtil";
import Task from "../task";

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

    @Watch("targetDate")
    onValueChange(newValue: string,oldValue: string): void {
        this.getTasks();
    }

    getTasks() : void {
        console.log("getTasks start!");
        firebase
        .firestore()
        .collection("users")
        .doc(this.$store.getters.user.uid)
        .collection("date")
        .doc(util.getDateString(this.$store.getters.targetDate))
        .get()
        .then(doc => {
            if (doc.exists && doc.data()!.tasks ) {
                //どうしても!で無視しないと通らなかった。手前でundefinedチェックしても駄目。
                this.$store.commit("setTasks", doc.data()!.tasks);
                console.log("tasks=" + doc.data()!.tasks);
            }else{
                console.log("tasks not found");
                this.$store.commit("setTasks",[]);
            }
        });
    }

    deleteTask(index: number) : void {
        this.$store.commit("deleteTask",index);
        fb.saveTasks(this.$store.getters.user.uid, this.$store.getters.targetDate,this.$store.getters.tasks);
    }

    startTask(item: Task) : void {
        item.isDoing = true;
    }

    stopTask(item: {}) : void {

    }

    created() : void {
        this.getTasks();
    }

    logout() : void {
        firebase.auth().signOut();
    }
}
</script>
