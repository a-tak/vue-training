<template>
    <v-container grid-list-md text-xs-center pa-2>
        <v-layout
        align-center
        row
        v-if="!isEdit_"
        >
            <v-flex>
                <v-card>
                    <v-layout align-center justify-space-between row fill-height>
                        <v-flex xs4 sm2 md1>
                            <v-btn icon ripple @click.stop="startTask(task_)" v-if="task_.isDoing === false && task_.endTime==null">
                                <v-icon color="purple">play_circle_filled</v-icon>
                            </v-btn>
                            <v-btn icon ripple @click.stop="startTask(task_)" v-else-if="task_.isDoing === false && task_.endTime!=null">
                                <v-icon color="grey">play_circle_filled</v-icon>
                            </v-btn>
                            <v-btn icon ripple @click.stop="stopTask(task_)" v-else-if="task_.isDoing === true">
                                <v-icon color="purple">pause_circle_filled</v-icon>
                            </v-btn>
                        </v-flex>
                        <v-flex nowrap sm5 md5>
                            <v-card-actions  @click.stop="startEdit()">
                                <div v-bind:class="{ done: task_.endTime!=null}" class="font-weight-bold">
                                    {{ task_.title }}
                                </div>
                            </v-card-actions>
                            <v-card-actions  @click.stop="startEdit()">
                                <div>開始:{{ getTime(task_.startTime) }} / 終了: {{ getTime(task_.endTime)}} / 実績: {{ task_.actualTime }}分 / 見積: {{ task_.estimateTime }}分 </div>
                            </v-card-actions>
                        </v-flex>
                        <v-spacer></v-spacer>
                        <v-flex xs4 sm2 md1 class="text-xs-right">
                            <v-menu
                                :close-on-content-click="true"
                                v-model="displayedTaskCal"
                                :nudge-right="40"
                                lazy
                                transition="scale-transition"
                                offset-y
                                full-width
                                min-width="290px"
                            >
                            <v-btn slot="activator" icon ripple @click.stop="displayedTaskCal = !displayedTaskCal">
                                <v-icon color="grey lighten-1">calendar_today</v-icon>
                            </v-btn>

                            <v-date-picker v-model="targetDate" @input="displayedTaskCal = false" locale="jp" :day-format="date => new Date(date).getDate()"></v-date-picker>
                            </v-menu>
                        </v-flex>
                        <v-flex xs4 sm2 md1 class="text-xs-right">
                            <v-btn icon ripple @click.stop="deleteTask(index_)">
                                <v-icon color="grey lighten-1">delete</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
        <v-layout
        align-center
        row
        v-if="isEdit_"
        >
            <v-card>
                <TaskEdit v-bind:task_="task_" v-bind:index_="index_" v-on:endEditEvent="endEditEvent"></TaskEdit>
            </v-card>
        </v-layout>
    </v-container>
</template>

<style>
.done {
    text-decoration: line-through;
}
</style>

<script lang="ts">
import { Component, Vue, Watch, Prop, Emit } from 'vue-property-decorator';
import NewTask from "@/components/NewTask.vue";
import TaskEdit from "@/components/TaskEdit.vue";
import util from "../util/Util";
import Task from '../lib/Task';

@Component({
  components: {
    NewTask,
    TaskEdit,
  },
})

export default class TaskRow extends Vue {

    @Prop() task_!: Task;
    @Prop() index_!: number;

    @Emit("clickStartButtomEvent")
    startTask(task: Task): void{}

    @Emit("clickStopButtomEvent")
    stopTask(task: Task): void{}

    @Emit("clickDeleteButtomEvent")
    deleteTask(index: number): void{}

    @Emit('endEditEvent')
    endEdit(task: Task, index: number): void {}

    /**
     * タスクの日付が変更された時の処理
     */
    @Watch("targetDate")
    onValueChange(newValue: string,oldValue: string): void {

    }

    private isEdit_: boolean = false;

    private displayedTaskCal_: boolean = false;
    get displayedTaskCal() : boolean{
        return this.displayedTaskCal_;
    }
    set displayedTaskCal(value: boolean) {
        console.log("targetDate_=" + this.targetDate_);
        this.displayedTaskCal_ = value;
    }

    private targetDate_:Date = new Date();
    get targetDate(): string {
      return this.$store.getters.targetDate.toISOString().substr(0, 10)
    }
    /**
     * 特殊だけどセットするときはストアに値をセットしたいわけではないのでインスタンス変数に入れる
     * あとでもう少し考える
     */
    set targetDate(value:string) {
        this.targetDate_ = new Date(value);
    }

    getTime(time: Date) : string {
        let timeStr: string = "";
        if (time != null) {
            timeStr = util.getTimeString(time);
        }
        return timeStr;
    }

    startEdit() : void {
        this.isEdit_ = true;
    }

    endEditEvent(task: Task, index: number) {
        this.isEdit_ = false;
        this.endEdit(task,index);
    }

}
</script>