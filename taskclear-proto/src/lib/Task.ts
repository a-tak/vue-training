import firebase,{ firestore } from 'firebase';
import uuid from 'uuid';

export default class Task {

    constructor(date:Date, title: string) {
        this.id_ = uuid();
        this.date_ = date;
        this.title_ = title;
        this.isDoing_ = false;
        this.startTime_ = null;
        this.endTime_ = null;
    }

    private id_: string;
    private date_: Date;
    private title_ : string;
    private isDoing_: boolean;
    private startTime_: Date | null;
    private endTime_: Date | null;

    get id(): string { return this.id_ }
    set id(value: string) { this.id_ = value }
    get date(): Date { return this.date_ }
    set date(value: Date) { this.date_ = value }
    get title(): string { return this.title_ }
    set title(value: string) { this.title_ = value }
    get isDoing(): boolean { return this.isDoing_ }
    set isDoing(value: boolean) { this.isDoing_ = value }
    get startTime(): Date | null { return this.startTime_ }
    set startTime(value: Date | null) { this.startTime_ = value }
    get endTime(): Date | null { return this.endTime_ }
    set endTime(value: Date | null) { this.endTime_ = value }

    /**
     * 中断タスクを作成
     */
    createPauseTask(): Task {
        let newTask: Task = new Task(this.date_,this.title);
        newTask.isDoing = false;
        newTask.startTime = null;
        newTask.endTime = null;

        return newTask;
    }

    /**
     * タスクをコピー
     * キャンセル機能などで元の値を待避するために使用
     */
    copy(): Task {
        let newTask: Task = new Task(this.date_,this.title);
        newTask.id = this.id_;
        newTask.isDoing = this.isDoing_;
        newTask.startTime = this.startTime_;
        newTask.endTime = this.endTime_;

        return newTask;

    }

}
