import firebase,{ firestore } from 'firebase';
import uuid from 'uuid';

export default class Task {

    constructor(date:Date, title: string) {
        this._id = uuid();
        this._date = date;
        this._title = title;
        this._isDoing = false;
        this._startTime = null;
        this._endTime = null;
    }

    private _id: string;
    private _date: Date;
    private _title : string;
    private _isDoing: boolean;
    private _startTime: Date | null;
    private _endTime: Date | null;

    get id(): string { return this._id }
    set id(value: string) { this._id = value }
    get date(): Date { return this._date }
    set date(value: Date) { this._date = value }
    get title(): string { return this._title }
    set title(value: string) { this._title = value }
    get isDoing(): boolean { return this._isDoing }
    set isDoing(value: boolean) { this._isDoing = value }
    get startTime(): Date | null { return this._startTime }
    set startTime(value: Date | null) { this._startTime = value }
    get endTime(): Date | null { return this._endTime }
    set endTime(value: Date | null) { this._endTime = value }

    /**
     * 中断タスクを作成
     */
    createPauseTask(): Task {
        let newTask: Task = new Task(this._date,this.title);
        newTask.isDoing = false;
        newTask.startTime = null;
        newTask.endTime = null;

        return newTask;
    }

}
