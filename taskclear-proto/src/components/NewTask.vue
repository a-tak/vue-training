<template>
    <div id="newtask">
        <v-text-field></v-text-field>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
    NewTask
  },
})
export default class NewTask extends Vue {
};
</script>


