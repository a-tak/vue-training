<template>
    <div id="newtask" class="newtaskwrapper">
      <v-layout align-center justify-center row fill-height>
        <v-card class="ma-2">
          <v-text-field class="newtaskfield"></v-text-field><v-btn class="addButton">追加</v-btn>
        </v-card>
      </v-layout>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class NewTask extends Vue {
};
</script>

<style>
.newtaskwrapper {
  
}
.newtaskfield {
  width: 80%;
}
.addButton {
}
</style>


