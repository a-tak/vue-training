import firebase,{ firestore } from 'firebase';
import Task from './Task';
import ITask from '@/ITask';

// Taskオブジェクトを束ねるクラス
export default class TaskController {
    
    tasks_: Task[] = [];
    
    get tasks(): Task[] { return this.tasks_ }
    set tasks(value: Task[]) { this.tasks_ = value }

    /**
     * Firestore保存用のオブジェクトリテラルを取得する
     */
    createFirestoreLiteral(): ITask[] {
        let literals: ITask[] = []; 
        for (const task of this.tasks_) {
            let literal: ITask = {
                id: task.id,
                date: firestore.Timestamp.fromDate(task.date),
                title: task.title,
                isDoing: task.isDoing,
                startTime: null,
                endTime: null,
            }
            if (task.startTime!=null) { literal.startTime = firestore.Timestamp.fromDate(task.startTime)};
            if (task.endTime!=null) { literal.endTime = firestore.Timestamp.fromDate(task.endTime)};

            literals.push(literal);
        }
       return literals;
    }

    loadFirestoreLiteral(fsObjs: ITask[]) : void {
        console.log("start loadFirestoreLiteral");
        console.log("fsObj count=" + fsObjs.length);
        this.tasks_ = [];
        for (const fsobj of fsObjs) {
            let task = new Task();
            task.id = fsobj.id;
            task.date = fsobj.date.toDate();
            task.title = fsobj.title;
            task.isDoing = fsobj.isDoing;
            if (fsobj.startTime !=null) {
                task.startTime = fsobj.startTime.toDate();
            }else {
                task.startTime = null;
            }
            if (fsobj.endTime !=null) {
                task.endTime = fsobj.endTime.toDate();
            }else {
                task.endTime = null;
            }
            this.tasks_.push(task);
        }
        console.log("tasks_ count" + this.tasks_.length);
    }
}