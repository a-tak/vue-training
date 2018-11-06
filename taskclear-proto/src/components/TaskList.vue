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
        <v-layout align-center justify-center row fill-height ma-2>
            <v-flex>
                <NewTask></NewTask>
            </v-flex>
        </v-layout>
        <v-layout row align-center justify-center>
            <v-flex sm7>
                <v-card>
                    <v-list three-line>
                        <v-list-tile v-for="(item, index) in tasks" :key="item.id" @click="">
                            <v-list-tile-action>
                                <v-btn icon ripple @click="startTask(item)" v-if="item.isDoing === false">
                                    <v-icon color="purple">play_circle_filled</v-icon>
                                </v-btn>
                                <v-btn icon ripple @click="stopTask(item)" v-if="item.isDoing === true">
                                    <v-icon color="purple">pause_circle_filled</v-icon>
                                </v-btn>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>
                                    {{ item.title }}
                                </v-list-tile-title>
                                <v-list-tile-sub-title>開始:{{ getTime(item.startTime) }} / 終了: {{ getTime(item.endTime) }}</v-list-tile-sub-title>
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
import firebase,{ firestore } from "firebase"
import NewTask from "@/components/NewTask.vue"
import util from "../util";
import fb from "../firebaseUtil";
import ITask from "../ITask";
import uuid from 'uuid';
import { exists } from 'fs';

@Component({
  components: {
    NewTask
  },
})

export default class TaskList extends Vue {

    get tasks():ITask[] {
        return this.$store.getters.tasks;
    }

    set tasks(value: ITask[]) {
        this.$store.commit("setTasks", value);
    }
    
    get targetDate(): string {
      return this.$store.getters.targetDate.toISOString().substr(0, 10)
    }

    set targetDate(value:string) {
        this.$store.commit("setTargetDate",new Date(value));
    }

    private menu2_: boolean = false;

    get menu2() : boolean{
        return this.menu2_;
    }

    set menu2(value: boolean) {
        this.menu2_ = value;
    }

    //日付を変更したのを監視してタスクを読み込み直し
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
            if (doc.exists) {
                const firedoc: firebase.firestore.DocumentData | undefined  = doc.data();
                if (firedoc !== undefined ) {
                    this.$store.commit("setTasks", firedoc.tasks);
                }
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

    startTask(task: ITask) : void {
        //開始しているタスクがあれば中断処理する
        this.tasks.forEach(function (this: TaskList, otherTask:ITask, index, array) {
            if (otherTask.isDoing == true) {
                this.stopTask(otherTask);
                let newTask: ITask = {id: uuid(),
                                      date: firestore.Timestamp.now(),
                                      title: otherTask.title,
                                      startTime: null,
                                      endTime: null,
                                      isDoing: false};
                array.push(newTask);
                return;
            }
        },this);
        task.isDoing = true;
        task.startTime = firestore.Timestamp.now();

        this.tasks.sort(function(a: ITask,b: ITask){
            if (a.startTime == null) {
                return 1;
            }else if(b.startTime == null) {
                return -1;
            } else {
                return a.startTime.nanoseconds - b.startTime.nanoseconds;
            }
        });

        fb.saveTasks(this.$store.getters.user.uid, this.$store.getters.targetDate,this.$store.getters.tasks);
    }

    stopTask(task: ITask) : void {
        task.isDoing = false;
        task.endTime = firestore.Timestamp.now();
        fb.saveTasks(this.$store.getters.user.uid, this.$store.getters.targetDate,this.$store.getters.tasks);
    }

    getTime(time: firestore.Timestamp) : string {
        let timeStr: string = "";
        //なぜかDate型渡しているのにgetHours()がないとか怒られる謎。InterfaceってObject入るんだっけ?ここは後で直す
        //仕方ないのでObjectが入っている時もスキップするようにした
        console.log("time instance =" + Object.prototype.toString.call(time));
        if (time != null) {
            timeStr = util.getTimeString(time.toDate());
        }
        return timeStr;
    }

    created() : void {
        this.getTasks();
    }

    logout() : void {
        firebase.auth().signOut();
    }
}
</script>
