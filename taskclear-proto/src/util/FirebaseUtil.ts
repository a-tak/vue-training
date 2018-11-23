import DateUtil from "./DateUtil";
import firebase, { firestore } from "firebase"
import TaskController from '../lib/TaskController';
import Task from '@/lib/Task';

export default class FirebaseUtil {
    static saveTasks(uid: string, date: Date, taskctrl: TaskController) : void {
        // 一旦時間は0:00でセット。セクションを取り入れるときはここの時間をセクションの時間に変更する
        const d = new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0,0);

        for (const task of taskctrl.createFirestoreLiteral()) {
            firebase.firestore().collection("users").doc(uid)
            .collection("tasks").doc(task.id).set(task);
        }
    }

    /**
     * Firestoreからデータを読み込み結果を含んだPromiseを返す
     * @param uid 
     * @param date 
     */
    static async loadTasks(uid: string, date: Date) : Promise<TaskController> {
        let tc = new TaskController();
        
        const query:firestore.QuerySnapshot = await this.getQuery(uid, date).get();

        query.forEach(doc => {
            if (doc !== undefined) {
                const data: firebase.firestore.DocumentData | undefined = doc.data();
                tc.tasks.push(this.setTask(data));
            } else {
                console.log("doc undefined?");
            }
        });
        return tc;
    }
    
    static getQuery(uid: string, date: Date): firestore.Query {
        //とりあえず今は一日の区切りを0時としてfrom,toを作る
        //新たにnewしてセットしないと参照が書き換わるだけでendがおかしくなる
        const from: Date = new Date(date);
        from.setHours(0,0,0,0);
        const to: Date = new Date(date);
        to.setDate(date.getDate()+1);
        to.setHours(0,0,0,0);

        return firebase
            .firestore()
            .collection("users")
            .doc(uid)
            .collection("tasks")
            .where("date",">=",firestore.Timestamp.fromDate(from))
            .where("date","<",firestore.Timestamp.fromDate(to));
    }


    static setTask(data: firestore.DocumentData) : Task {
        let task = new Task(data.date.toDate(), data.title);
        task.id = data.id;
        task.startTime =  this.toDate(data.startTime);
        task.endTime = this.toDate(data.endTime);
        task.estimateTime = data.estimateTime;
        task.isDoing = data.isDoing;
        return task;
    }

    static toDate(date: firestore.Timestamp | undefined) : Date | null {
        if (date === undefined || date === null) {
            return null;
        }else {
            return date.toDate();
        }
    }
}