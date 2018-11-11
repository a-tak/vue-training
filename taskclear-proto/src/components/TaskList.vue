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

        <v-layout
            column
            justify-center
        >
            <v-expansion-panel popout v-model="panel_" expand focusable>
                <v-expansion-panel-content
                    v-for="(task, index) in tasks"
                    :key="task.id"
                    hide-actions
                    @click="editTask(index)"
                >
                    <v-layout
                    slot="header"
                    align-center
                    row
                    spacer
                    >
                        <v-flex xs4 sm2 md1>
                            <v-btn icon ripple @click.stop="startTask(task)" v-if="task.isDoing === false && task.endTime==null">
                                <v-icon color="purple">play_circle_filled</v-icon>
                            </v-btn>
                            <v-btn icon ripple @click.stop="startTask(task)" v-else-if="task.isDoing === false && task.endTime!=null">
                                <v-icon color="grey">play_circle_filled</v-icon>
                            </v-btn>
                            <v-btn icon ripple @click.stop="stopTask(task)" v-else-if="task.isDoing === true">
                                <v-icon color="purple">pause_circle_filled</v-icon>
                            </v-btn>
                        </v-flex>
                        <v-flex sm5 md3>
                            <span v-bind:class="{ done: task.endTime!=null}">
                                {{ task.title }}
                            </span>
                        </v-flex>
                        <v-flex nowrap sm5 md3>
                            <span>開始:{{ getTime(task.startTime) }} / 終了: {{ getTime(task.endTime)}} / 実績: {{ task.actualTime }}分 / 見積: {{ task.estimateTime }}分 </span>
                        </v-flex>
                        <v-flex xs4 sm2 md1 class="text-xs-right">
                            <v-btn icon ripple @click.stop="deleteTask(task)">
                                <v-icon color="grey lighten-1">delete</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                    <v-card>
                        <v-divider></v-divider>
                        <TaskEdit v-bind:task_="task" v-bind:index_="index" v-on:endEditEvent="endEditTask"></TaskEdit>
                    </v-card>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-layout>
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
import TaskEdit from "@/components/TaskEdit.vue";
import util from "../util/Util";
import fb from "../util/FirebaseUtil";
import uuid from 'uuid';
import { exists } from 'fs';
import Task from '../lib/Task';
import TaskController from '../lib/TaskController';

@Component({
  components: {
    NewTask,
    TaskEdit,
  },
})

export default class TaskList extends Vue {

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

    getTime(time: Date) : string {
        let timeStr: string = "";
        if (time != null) {
            timeStr = util.getTimeString(time);
        }
        return timeStr;
    }

    created() : void {
        this.loadTasks();
    }

    logout() : void {
        firebase.auth().signOut();
    }
}
</script>
