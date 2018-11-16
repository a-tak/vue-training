<template>
    <div id="tasklist">
        <v-toolbar
        color="teal lighten-3"
        dark
        >
        <v-toolbar-side-icon></v-toolbar-side-icon>

        <v-toolbar-title>TaskClear</v-toolbar-title>

        <v-btn @click="logout">ログアウト</v-btn>
        <v-spacer></v-spacer>
        <v-btn icon>
            <v-icon>more_vert</v-icon>
        </v-btn>

        </v-toolbar>
        <div
        >
        <v-card>
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
            <v-date-picker v-model="targetDate" @input="menu2 = false" locale="jp" :day-format="date => new Date(date).getDate()"></v-date-picker>
            </v-menu>
        </v-card>
        <v-btn fab dark color="red" fixed floating bottom right @click="addTask()">
            <v-icon dark>add</v-icon>
        </v-btn>
            <v-slide-y-transition
                    class="py-0"
                    group
                    tag="v-list"
                >
                <TaskRow
                    v-for="(task, index) in tasks"
                    :key="task.id"
                    :task_="task"
                    :index_="index"
                    v-on:clickStartButtomEvent="startTask"
                    v-on:clickStopButtomEvent="stopTask"
                    v-on:endEditEvent="endEditTask"
                    v-on:clickDeleteButtomEvent="deleteTask"
                >
                </TaskRow>
            </v-slide-y-transition>
            <NewTask v-if="addingTask_" v-on:addedEvent="addedTask"></NewTask>
        </div>
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

    private addingTask_: boolean = false;

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
                this.tasks.push(otherTask.createPauseTask());
                otherTask.title = otherTask.title + "(中断)";
                this.stopTask(otherTask);
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

    endEditTask(task: Task, index: number) {
        console.log("endEditTask Event rise=" + index + "task=" + task.title);
        this.$set(this.tasks, index, task);
        this.save();
    }

    created() : void {
        this.loadTasks();
    }

    logout() : void {
        firebase.auth().signOut();
    }

    addTask() : void {
        this.addingTask_ = true;
        this.$nextTick(function(){
            this.$vuetify.goTo("#newtask", {duration: 350, easing: "easeInOutCubic"})
        });
    }

    addedTask() : void {
        this.addingTask_ = false;
    }
}
</script>