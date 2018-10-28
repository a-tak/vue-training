<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      For guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    <v-card>
      <v-text-field class="textbox" v-model="message" single-line box>ここに値を</v-text-field>
    </v-card>
    
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import store from '../store';

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;

  get message(): string {
    console.log("get msg=" + store.getters.message);
    return store.getters.message;
  }
  set message(msg: string) {
    store.dispatch('doUpdateMessage', msg);
    console.log("set msg=" + store.getters.message)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 5px;
}
a {
  color: #42b983;
}
.textbox {
  margin: 10px;
}
</style>
