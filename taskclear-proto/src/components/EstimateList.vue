<template>
    <div id="estimate-list">
        <v-card>
            <v-layout row>
                <v-flex>
                    <v-layout column>
                        <v-flex v-for="(estimate, index) in estimates" v-if="index<=2" :key="estimate.dateStr">
                            <div v-if="index==0" class="headline">
                                ({{ estimate.dayLabel }}) {{ estimate.estimateTime}} 分
                            </div>
                            <div v-else>
                                ({{ estimate.dayLabel }}) {{ estimate.estimateTime}} 分
                            </div>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex>
                    <v-layout column>
                        <v-flex v-for="(estimate, index) in estimates" v-if="3 <= index" :key="estimate.dateStr">
                            ({{ estimate.dayLabel }}) {{ estimate.estimateTime}} 分
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
import Util from '../util/Util';
import { firestore } from 'firebase';

@Component
export default class EstimateList extends Vue {

    private estimates_: Estimate[]= [];

    get estimates(): Estimate[] {
        return this.estimates_;
    }

    created() : void {
        this.display();
    }

    display() : void {

        let fsdsPromises: Promise<firebase.firestore.DocumentSnapshot>[] = new Array(6);

        for (let n=0; n<=6; n++) {
            // 一日ずつ日付を進めてデータを取得
            let tc: TaskController = new TaskController();
            let targetDate: Date = new Date();
            targetDate.setDate(this.$store.getters.targetDate.getDate() + n);
            console.log("display 1");

            //Promiseを配列に溜めておく
            fsdsPromises[n] =             
                firestore()
                .collection("users")
                .doc(this.$store.getters.user.uid)
                .collection("date")
                .doc(Util.getDateString(targetDate))
                .get()

            //非同期処理の登録
            fsdsPromises[n].then(doc => {
                if (doc.exists) {
                    console.log("loadTasks 2");

                    const firedoc: firebase.firestore.DocumentData | undefined  = doc.data();
                    if (firedoc !== undefined && firedoc.tasks != undefined) {
                        tc.loadFirestoreLiteral(firedoc.tasks);

                        let estimate = new Estimate();
                        estimate.date = targetDate;
                        const weekday:string[] = [ "日", "月", "火", "水", "木", "金", "土" ] ;
                        estimate.dayLabel = weekday[targetDate.getDay()];
                        estimate.estimateTime = tc.getEstimateSum().toString();
                        this.estimates_.push(estimate);

                    } else {
                        console.log("doc undefined?");
                    }
                } else {
                    let estimate = new Estimate();
                    estimate.date = targetDate;
                    const weekday:string[] = [ "日", "月", "火", "水", "木", "金", "土" ] ;
                    estimate.dayLabel = weekday[targetDate.getDay()];
                    estimate.estimateTime = "0";
                    this.estimates_.push(estimate);
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });

            //1週間分のデータが全部非同期で取れたらソート
            Promise.all(fsdsPromises).then(tc => {
                //描画処理
                this.estimates_.sort(function(a: Estimate, b: Estimate) : number {
                    if (a.date == null) {
                        return 1;
                    }else if(b.date == null) {
                        return -1;
                    } else {
                        return a.date.getTime() - b.date.getTime();
                    }
                })
            })
        }
    }
};

class Estimate extends Vue {
    
    
    private  date_ : Date = new Date();
    public get date() : Date {
        return this.date_;
    }
    public set date(v : Date) {
        this. date_ = v;
    }
    public get dateStr(): string {
        return Util.getDateString(this.date_);
    }

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
