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

        
        const query:firestore.QuerySnapshot = 
        await firebase
            .firestore()
            .collection("users")
            .doc(uid)
            .collection("tasks")
            .where("date",">=",firestore.Timestamp.fromDate(date))
            .get();

        console.log(`ヒット件数  ${query.size} (uid=${uid} date=${date})`);
        query.forEach(doc => {
            if (doc !== undefined) {
                const data: firebase.firestore.DocumentData | undefined = doc.data();
                let task = new Task(data.date.toDate(), data.title);
                task.id = data.id;
                task.startTime =  this.toDate(data.startTime);
                task.endTime = this.toDate(data.endTime);
                task.estimateTime = data.estimateTime;
                task.isDoing = data.isDoing;
                tc.tasks.push(task);
            } else {
                console.log("doc undefined?");
            }
        });
        return tc;
    }

    static toDate(date: firestore.Timestamp | undefined) : Date | null {
        if (date === undefined || date === null) {
            return null;
        }else {
            return date.toDate();
        }
    }

    /**
     * Firestoreからデータを読み込み
     * Promiseで返すのでthenで処理するかawait指定で呼び出して戻り値に入れて処理する事
     * 読み込んだ後に後続で何か処理するならばこちらを使わないと、読み込み前に次の処理が行われてしまう
     * いずれloadTasksの方は消すかも
     * @param uid 
     * @param date 
     */
    static async loadTasksPromise(uid: string, date: Date) : Promise<TaskController> {
        let tc = new TaskController();

        const doc = await firebase
            .firestore()
            .collection("users")
            .doc(uid)
            .collection("date")
            .doc(DateUtil.getDateString(date))
            .get()

        if (doc.exists) {

            const firedoc: firebase.firestore.DocumentData | undefined  = doc.data();
            if (firedoc !== undefined && firedoc.tasks != undefined) {
                tc.loadFirestoreLiteral(firedoc.tasks);
            } else {
                console.log("doc undefined?");
            }
        } else {
            console.log("no such document");
        }

        return tc;
    } 
}