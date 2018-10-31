<template>
    <div id="newtask">
      <v-card>
        <v-layout row wrap fill-height align-center justify-center>
            <v-flex class="ma-2">
                <v-text-field placeholder="新しいタスクを追加" outline v-model="inputvalue"></v-text-field>
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

@Component
export default class NewTask extends Vue {

  inputvalue: string = "";

  addTask() : void {
    this.$store.commit("addTask", this.inputvalue);
    this.inputvalue="";
  }
};
</script>

<style>
</style>


