<template>
    <v-container grid-list-md text-xs-center>
        <v-layout
        slot="header"
        align-center
        row
        spacer
        >
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
                <div v-bind:class="{ done: task_.endTime!=null}" class="font-weight-bold">
                    {{ task_.title }}
                </div>
                <div>開始:{{ getTime(task_.startTime) }} / 終了: {{ getTime(task_.endTime)}} / 実績: {{ task_.actualTime }}分 / 見積: {{ task_.estimateTime }}分 </div>
            </v-flex>
            <v-flex xs4 sm2 md1 class="text-xs-right">
                <v-btn icon ripple @click.stop="deleteTask(index_)">
                    <v-icon color="grey lighten-1">delete</v-icon>
                </v-btn>
            </v-flex>
        </v-layout>
        <v-card>
            <v-divider></v-divider>
            <TaskEdit v-bind:task_="task_" v-bind:index_="index_" v-on:endEditEvent="endEditTask"></TaskEdit>
        </v-card>
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


    getTime(time: Date) : string {
        let timeStr: string = "";
        if (time != null) {
            timeStr = util.getTimeString(time);
        }
        return timeStr;
    }

}
</script>