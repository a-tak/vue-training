<template>
    <div id="tasklist">
        <v-content>
            <h1 class="title">タスクリスト</h1>
            <NewTask></NewTask>
        </v-content>
    </div>
</template>
<script>
import { Component, Vue } from 'vue-property-decorator';
import firebase from "firebase"
import NewTask from "@/components/NewTask.vue"

@Component({
  components: {
    NewTask
  },
})

export default class TaskList extends Vue {
};
</script>
