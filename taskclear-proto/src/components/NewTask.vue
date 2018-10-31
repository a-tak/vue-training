<template>
    <div id="newtask">
      <v-card>
        <v-layout row wrap fill-height align-center justify-center>
            <v-flex class="ma-2">
                <v-text-field placeholder="新しいタスクを追加" outline ></v-text-field>
            </v-flex>
            <v-flex>
                <v-btn>追加</v-btn>
            </v-flex>
        </v-layout>
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
</style>


