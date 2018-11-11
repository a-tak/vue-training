<template>
    <div id="task-edit">
        <v-layout row fill-height align-center justify-center>
            <v-flex mt-4 ml-2>
                <v-text-field placeholder="タスク名" single-line outline v-model="task_.title" clearable  @keyup.enter="save" @keypress="setCanSubmit"></v-text-field>
            </v-flex>
            <v-flex ma-2>
                <v-btn @click.stop="save">保存</v-btn>
            </v-flex>
            <v-flex ma-2>
                <v-btn @click.stop="cancel">キャンセル</v-btn>
            </v-flex>
        </v-layout>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import Task from '../lib/Task';
import TaskController from '../lib/TaskController';

@Component
export default class TaskEdit extends Vue {

    canSubmit_: boolean = false;

    //!はundefinedやnullにならないことを示すもの
    @Prop() task_!: Task;
    
    @Emit('endEditEvent')
    endEdit(task: Task): void {}

    backupedTask_!: Task;

    save(): void {
        this.endEdit(this.task_);
    }
    
    cancel(): void{
        this.endEdit(this.backupedTask_);
    }

    setCanSubmit(): void {
        this.canSubmit_ = true;
    }

    created(): void {
        this.backupedTask_ = this.task_.copy();
    }

};
</script>

<style>
</style>


