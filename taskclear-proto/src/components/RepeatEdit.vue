<template>
    <div id="repeat-edit">
        <v-card class="ma-2">
            <v-layout v-bind="layoutAttributes" fill-height align-center justify-center row>
                <v-flex ml-3>
                    <v-layout column fill-height align-center justify-center>
                        <v-flex>
                            <v-checkbox v-model="selectedDay_" label="月曜日" value=1></v-checkbox>
                        </v-flex>
                        <v-flex>
                            <v-checkbox v-model="selectedDay_" label="火曜日" value=2></v-checkbox>
                        </v-flex>
                        <v-flex>
                            <v-checkbox v-model="selectedDay_" label="水曜日" value=3></v-checkbox>
                        </v-flex>
                        <v-flex>
                            <v-checkbox v-model="selectedDay_" label="木曜日" value=4></v-checkbox>
                        </v-flex>
                        <v-flex>
                            <v-checkbox v-model="selectedDay_" label="金曜日" value=5></v-checkbox>
                        </v-flex>
                        <v-flex>
                            <v-checkbox v-model="selectedDay_" label="土曜日" value=6></v-checkbox>
                        </v-flex>
                        <v-flex>
                            <v-checkbox v-model="selectedDay_" label="日曜日" value=0></v-checkbox>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex>
                    <v-layout column fill-height align-center justify-center>
                        <v-flex>
                            <v-menu
                                :close-on-content-click="false"
                                v-model="menufrom_"
                                :nudge-right="40"
                                lazy
                                transition="scale-transition"
                                offset-y
                                full-width
                                min-width="290px"
                            >
                            <v-text-field
                                slot="activator"
                                v-model="dateFrom"
                                label="開始日"
                                prepend-icon="event"
                                readonly
                            ></v-text-field>
                            <v-date-picker v-model="dateFrom" @input="menufrom_ = false" locale="jp" :day-format="date => new Date(date).getDate()"></v-date-picker>
                            </v-menu>
                        </v-flex>
                        <v-flex>
                            <v-menu
                                :close-on-content-click="false"
                                v-model="menuto_"
                                :nudge-right="40"
                                lazy
                                transition="scale-transition"
                                offset-y
                                full-width
                                min-width="290px"
                            >
                            <v-text-field
                                slot="activator"
                                v-model="dateTo"
                                label="終了日"
                                prepend-icon="event"
                                readonly
                            ></v-text-field>
                            <v-date-picker v-model="dateTo" @input="menuto_ = false" locale="jp" :day-format="date => new Date(date).getDate()"></v-date-picker>
                            </v-menu>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
            <v-layout row fill-height align-center justify-center>
                <v-flex>
                    <v-btn @click.stop="save">保存</v-btn>
                </v-flex>
                <v-flex>
                    <v-btn @click.stop="cancel">キャンセル</v-btn>
                </v-flex>
            </v-layout>
        </v-card>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import Task from '../lib/Task';
import DateUtil from '../util/DateUtil';
import TaskController from '../lib/TaskController';

@Component
export default class RepeatEdit extends Vue {

    private menufrom_: boolean = false;
    private menuto_: boolean = false;
    private selectedDay_: number[] = [];
    private from_: Date = new Date();
    private to_: Date = new Date();

    get dateFrom() : string {
        return DateUtil.getDateString(this.from_);
    }
    set dateFrom(value: string) {
        this.from_ = new Date(value);
    }
    
    get dateTo() : string {
        return DateUtil.getDateString(this.to_);
    }
    set dateTo(value: string) {
        this.to_ = new Date(value);
    }

    //!はundefinedやnullにならないことを示すもの
    @Prop() task_!: Task;

    private backupedTask_: Task;
    
    @Emit('endRepeatEditEvent')
    endEdit(task: Task): void {}

    constructor () {
        super();
        this.backupedTask_ = this.task_.copy();
    }

    save(): void {
        //編集終了イベント発生
        this.endEdit(this.task_);
    }
    
    cancel(): void{
        this.endEdit(this.backupedTask_);
    }


    created(): void {
        this.backupedTask_ = this.task_.copy();
    }

    //算出プロパティーでオブジェクトを返すと属性を展開してくれる
    get layoutAttributes() : {} {
        //画面サイズによって入力ボックスを横に並べるか縦に並べるか切り替える
        switch (this.$vuetify.breakpoint.name) {
            case 'xs': return {column: true};
            case 'sm': return {column: true};
            case 'md': return {row: true};
            case 'lg': return {row: true};
            case 'xl': return {row: true};
            default  : return {row: true};
        }
    }
};
</script>

<style>
</style>


