<template>
    <div id="newtask" class="newtaskwrapper">
        <v-card>
          <v-text-field class="newtaskfield"></v-text-field><v-btn class="addButton">追加</v-btn>
        </v-card>
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
  display: flex;
}
.newtaskfield {
  width: 50%;
  text-align: left;
}
.addButton {
  text-align: right;
}
</style>


