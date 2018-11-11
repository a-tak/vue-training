<template>
    <div id="task-edit">
        <v-layout row fill-height align-center justify-center>
            <v-flex>
                <v-text-field placeholder="タスク名" single-line outline v-model="task_.title" clearable  @keyup.enter="save" @keypress="setCanSubmit"></v-text-field>
            </v-flex>
            <v-flex>
                <v-text-field placeholder="開始時間" single-line outline mask="####" hint="数字3または4桁。9時20分は「920」と入力" v-model="startTime_" clearable  @keyup.enter="save" @keypress="setCanSubmit"></v-text-field>
            </v-flex>
            <v-flex>
                <v-text-field placeholder="終了時間" single-line outline mask="####" hint="数字3または4桁。9時20分は「920」と入力" v-model="endTime_" clearable  @keyup.enter="save" @keypress="setCanSubmit"></v-text-field>
            </v-flex>
            <v-flex>
                <v-btn @click.stop="save">保存</v-btn>
            </v-flex>
            <v-flex>
                <v-btn @click.stop="cancel">キャンセル</v-btn>
            </v-flex>
        </v-layout>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import Task from '../lib/Task';
import TaskController from '../lib/TaskController';
import Util from '../util/Util';

@Component
export default class TaskEdit extends Vue {

    canSubmit_: boolean = false;
    menu_: boolean = false;
    startTime_: string = "";
    endTime_: string = "";

    //!はundefinedやnullにならないことを示すもの
    @Prop() task_!: Task;
    
    @Emit('endEditEvent')
    endEdit(task: Task): void {}

    backupedTask_!: Task;

    save(): void {
        if (this.startTime_.trim() !="") {
            this.task_.startTime = Util.getDateObject(this.task_.date, this.startTime_);
        }else{
            this.task_.startTime = null;
        }

        if (this.endTime_.trim() !="") {
            this.task_.endTime = Util.getDateObject(this.task_.date, this.endTime_);
        }else{
            this.task_.endTime = null;
        }

        this.endEdit(this.task_);
    }
    
    cancel(): void{
        this.endEdit(this.backupedTask_);
    }

    setCanSubmit(): void {
        this.canSubmit_ = true;
    }

    created(): void {
        //編集前の値を待避
        this.backupedTask_ = this.task_.copy();

        if (this.task_.startTime!=null) {
            this.startTime_ = Util.get4digitTime(this.task_.startTime);
        }
        if (this.task_.endTime!=null) {
            this.endTime_ = Util.get4digitTime(this.task_.endTime);
        }
    }

};
</script>

<style>
</style>


