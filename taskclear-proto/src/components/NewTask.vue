<template>
    <div id="newtask">
      <v-card>
        <v-layout row wrap fill-height align-center justify-center>
            <v-flex class="ma-2">
                <v-text-field placeholder="新しいタスクを追加" outline v-model="inputvalue" clearable v-on:keyup.enter="addTask"></v-text-field>
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

  addTask() : void {
    if (this.inputvalue.trim()!="") {
      this.$store.commit("addTask", {id: uuid(), title: this.inputvalue});
      this.inputvalue="";

      firebase.firestore().collection("tasks").doc(this.$store.getters.user.uid).set({ tasks: this.$store.getters.tasks });

    }
  }


};
</script>

<style>
</style>


