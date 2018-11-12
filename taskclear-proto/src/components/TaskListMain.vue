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

        <TaskRow
            v-for="(task, index) in tasks"
            :key="task.id"
            :task_="task"
            :index_="index"
            v-on:clickStartButtomEvent="startTask(task)"
            v-on:clickStopButtomEvent="stopTask(task)"
        >
        </TaskRow>
    </div>
</template>

<style>
.done {
    text-decoration: line-through;
}
</style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import firebase,{ firestore } from "firebase";
import NewTask from "@/components/NewTask.vue";
import TaskRow from "@/components/TaskRow.vue";
import util from "../util/Util";
import fb from "../util/FirebaseUtil";
import uuid from 'uuid';
import Task from '../lib/Task';
import TaskController from '../lib/TaskController';

@Component({
  components: {
    NewTask,
    TaskRow,
  },
})

export default class TaskListMain extends Vue {

    //編集中のインデックスを保持。どこも編集中じゃ無い場合は-1。
    private editIndex_: number = -1;
    private panel_ = [];

    get tasks():Task[] {
        return this.$store.getters.taskCtrl.tasks;
    }

    set tasks(value: Task[]) {
        let tc: TaskController = new TaskController();
        tc.tasks = value;
        this.$store.commit("setTaskCtrl", tc);
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
        this.loadTasks();
    }

    loadTasks() : void {
        console.log("getTasks start!");
        firebase
        .firestore()
        .collection("users")
        .doc(this.$store.getters.user.uid)
        .collection("date")
        .doc(util.getDateString(this.$store.getters.targetDate))
        .get()
        .then(doc => {
            let tc = new TaskController();
            if (doc.exists) {
                // ここどうにかするし、エラーになる
                const firedoc: firebase.firestore.DocumentData | undefined  = doc.data();
                if (firedoc !== undefined ) {
                    if (firedoc.tasks != undefined) {
                        tc.loadFirestoreLiteral(firedoc.tasks)
                        this.$store.commit("setTaskCtrl", tc);
                    }else{
                        this.$store.commit("setTaskCtrl",tc);
                    }
                } else {
                    this.$store.commit("setTaskCtrl",tc);
                }
            }else{
                this.$store.commit("setTaskCtrl",tc);
            }
        });
    }

    deleteTask(index: number) : void {
        this.$store.commit("deleteTask",index);
        this.save();
    }

    startTask(task: Task) : void {
        //開始しているタスクがあれば中断処理する
        for (const otherTask of this.tasks) {
            if (otherTask.isDoing == true) {
                this.stopTask(otherTask);
                this.tasks.push(otherTask.createPauseTask());
            }
        }

        task.isDoing = true;
        task.startTime = new Date;

        this.tasks.sort(function(a: Task,b: Task){
            if (a.startTime == null) {
                return 1;
            }else if(b.startTime == null) {
                return -1;
            } else {
                return a.startTime.getTime() - b.startTime.getTime();
            }
        });

        this.save();
    }

    stopTask(task: Task) : void {
        task.isDoing = false;
        task.endTime = new Date();
        this.save();
    }

    save(): void {
        fb.saveTasks(this.$store.getters.user.uid, this.$store.getters.targetDate,this.$store.getters.taskCtrl);
    }

    editTask(index: number) {
        this.editIndex_ = index;
    }

    endEditTask(task: Task, index: number) {
        this.tasks[index] = task;
        this.panel_ =[];
        this.save();
    }

    created() : void {
        this.loadTasks();
    }

    logout() : void {
        firebase.auth().signOut();
    }
}
</script>
