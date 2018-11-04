<template>
    <div id="newtask">
      <v-card>
        <v-layout row wrap fill-height align-center justify-center>
            <v-flex class="ma-2">
                <v-text-field placeholder="新しいタスクを追加" outline v-model="inputvalue" clearable @keyup.enter="addTask" @keypress="setCanSubmit"></v-text-field>
            </v-flex>
            <v-flex>
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
    this.$store.commit("addTask",
        {id: uuid(), date: date,  title: this.inputvalue});

    firebase.firestore().collection("tasks").doc(this.$store.getters.user.uid).set({ tasks: this.$store.getters.tasks });

    this.inputvalue = "";
    this.canSubmit = false;

  }


};
</script>

<style>
</style>


