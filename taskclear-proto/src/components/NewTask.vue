<template>
    <div id="newtask">
      <v-card>
        <v-layout row fill-height align-center justify-center>
            <v-flex mt-4 ml-2>
                <v-text-field placeholder="新しいタスクを追加" single-line outline v-model="inputvalue" clearable hint="記載したらEnterか追加ボタン" @keyup.enter="addTask" @keypress="setCanSubmit"></v-text-field>
            </v-flex>
            <v-flex ma-2>
                <v-btn @click="addTask">追加</v-btn>
            </v-flex>
        </v-layout>
      </v-card>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import firebase from 'firebase';
import uuid from 'uuid';
import util from '../util';
import fb from '../firebaseUtil';
import ITask from '../ITask';

@Component
export default class NewTask extends Vue {

  inputvalue: string = "";
  canSubmit: boolean = false;

  setCanSubmit() {
    this.canSubmit = true;
  }

  addTask() : void {
    if (this.inputvalue.trim()=="" || this.canSubmit == false) return;

    //ここがタスクの追加部分
    const d: Date = this.$store.getters.targetDate;
    // 一旦時間は0:00でセット。セクションを取り入れるときはここの時間をセクションの時間に変更する
    const date = new Date(d.getFullYear(),d.getMonth(),d.getDate(),0,0,0,0);
    let task:ITask = {id: uuid(), date: date,  title: this.inputvalue, isDoing:false, startTime:null, endTime:null};
    this.$store.commit("addTask",
        task);

    fb.saveTasks(this.$store.getters.user.uid, this.$store.getters.targetDate,this.$store.getters.tasks);

    this.inputvalue = "";
    this.canSubmit = false;

  }


};
</script>

<style>
</style>


