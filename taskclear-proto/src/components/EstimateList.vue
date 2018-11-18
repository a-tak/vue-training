<template>
    <div id="estimate-list">
        <v-card>
            <v-layout row>
                <v-flex>
                    <v-layout column>
                        <v-flex v-for="(estimate, index) in estimates" v-if="index<=2" :key="estimate.dayLabel">
                            <div v-if="index==0" class="headline">
                                ({{ estimate.dayLabel }}) {{ estimate.estimateTime}}
                            </div>
                            <div v-else>
                                ({{ estimate.dayLabel }}) {{ estimate.estimateTime}}
                            </div>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex>
                    <v-layout column>
                        <v-flex v-for="(estimate, index) in estimates" v-if="3 <= index" :key="estimate.dayLabel">
                            ({{ estimate.dayLabel }}) {{ estimate.estimateTime}}
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-card>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import TaskController from '../lib/TaskController';
import FirebaseUtil from '../util/FirebaseUtil';

@Component
export default class EstimateList extends Vue {

    private estimates_: Estimate[]=[];

    get estimates(): Estimate[] {
        return this.estimates_;
    }

    created() : void {
        this.display();
    }

    display() : void {

        let estimatesArray: Estimate[] = [];
        for (let n=0; n<=6; n++) {
            // 一日ずつ日付を進めてデータを取得
            let tc: TaskController = new TaskController();
            let targetDate: Date = new Date();
            targetDate.setDate(this.$store.getters.targetDate.getDate() + n);
            console.log("display 1");
            tc = FirebaseUtil.loadTasks(this.$store.getters.user.uid, targetDate);

            // 見積時間を合計
            let estimate = new Estimate();
            estimate.dayLabel = "今日" + n;
            estimate.estimateTime = tc.getEstimateSum().toString();
            console.log("display 2");
            estimatesArray.push(estimate);
        }

        this.estimates_ = estimatesArray;
    }
};

class Estimate extends Vue {
    
    private dayLabel_ : string ="";
    public get dayLabel() : string {
        return this. dayLabel_;
    }
    public set dayLabel(v : string) {
        this. dayLabel_ = v;
    }       
    
    private  estimateTime_ : string = "";
    public get estimateTime() : string {
        return this. estimateTime_;
    }
    public set estimateTime(v : string) {
        this. estimateTime_ = v;
    }
};
</script>

<style>

</style>
