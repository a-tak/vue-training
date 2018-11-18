<template>
    <div id="task-edit">
        <v-layout v-bind="layoutAttributes" fill-height align-center justify-center ma-1>
            <v-flex ma-1>
                <span>タスク名</span>
                <v-text-field placeholder="タスク名" single-line outline v-model="editTask_.title" clearable  @keyup.enter="save" @keypress="setCanSubmit"></v-text-field>
            </v-flex>
            <v-flex ma-1>
                <span>開始時間</span>
                <v-text-field type="tel" placeholder="開始時間" single-line outline mask="####" hint="数字3または4桁。9時20分は「920」と入力" v-model="startTime_" clearable @keyup.enter="save"></v-text-field>
            </v-flex>
            <v-flex ma-1>
                <span>終了時間</span>
                <v-text-field type="tel" placeholder="終了時間" single-line outline mask="####" hint="数字3または4桁。9時20分は「920」と入力" v-model="endTime_" clearable  @keyup.enter="save"></v-text-field>
            </v-flex>
            <v-flex ma-1>
                <span>見積時間(分)</span>
                <v-text-field type="tel" placeholder="見積時間(分)" single-line outline mask="#####" hint="見積時間(分)を入力" v-model="estimateTime_" clearable @keyup.enter="save"> </v-text-field>
            </v-flex>
        </v-layout>
        <v-layout row fill-height align-center justify-center>
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

    //!はundefinedやnullにならないことを示すもの
    @Prop() task_!: Task;
    @Prop() index_!: number;
    
    @Emit('endEditEvent')
    endEdit(task: Task, index: number): void {}

    startTime_ : string = "";
    endTime_ : string = "";
    estimateTime_ : string ="";
    backupedTask_!: Task;
    editTask_!: Task;

    save(): void {
        if (this.startTime_.trim() !="") {
            this.editTask_.startTime = Util.getDateObject(this.task_.date, this.startTime_);
        }else{
            this.editTask_.startTime = null;
        }

        if (this.endTime_.trim() !="") {
            this.editTask_.endTime = Util.getDateObject(this.task_.date, this.endTime_);
        }else{
            this.editTask_.endTime = null;
        }

        if (Util.isNumber(this.estimateTime_)) {
            this.editTask_.estimateTime = Number(this.estimateTime_);
        } else {
            this.editTask_.estimateTime = 0;
        }

        //編集終了イベント発生
        this.endEdit(this.editTask_, this.index_);
    }
    
    cancel(): void{
        this.editTask_ = this.backupedTask_;
        this.endEdit(this.backupedTask_, this.index_);
    }

    setCanSubmit(): void {
        this.canSubmit_ = true;
    }

    created(): void {
        console.log("created!");
        //編集前の値を待避
        this.backupedTask_ = this.task_.copy();
        //編集用オブジェクト作成
        this.editTask_ = this.task_.copy();

        if (this.task_.startTime!=null) {
            this.startTime_ = Util.get4digitTime(this.task_.startTime);
        }
        if (this.task_.endTime!=null) {
            this.endTime_ = Util.get4digitTime(this.task_.endTime);
        }

        if (this.task_.estimateTime!=null) {
            this.estimateTime_ = this.task_.estimateTime.toString();
        }

    }

    //算出プロパティーでオブジェクトを返すと属性を展開してくれる
    get layoutAttributes() : {} {
        //画面サイズによって入力ボックスを横に並べるか縦に並べるか切り替える
        switch (this.$vuetify.breakpoint.name) {
            case 'xs': return {column: true};
            case 'sm': return {column: true};
            case 'md': return {row: true};
            case 'lg': return {row: true};
            case 'xl': return {row: true};
            default  : return {row: true};
        }
    }
};
</script>

<style>
</style>


