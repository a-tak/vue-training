import DateUtil from "./DateUtil";
import firebase, { firestore } from "firebase"
import TaskController from '../lib/TaskController';
import Task from '@/lib/Task';
import Repeat from '@/lib/Repeat';

export default class FirebaseUtil {
    static saveTasks(uid: string, date: Date, taskctrl: TaskController) : void {
        // 一旦時間は0:00でセット。セクションを取り入れるときはここの時間をセクションの時間に変更する
        const d = new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0,0);
        //todo ここもbatch書き込みが必要
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

        query.forEach((doc:firestore.QueryDocumentSnapshot) : void => {
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

    public static deleteTask(uid:string, task:Task) : void {
        firebase.firestore().collection("users").doc(uid)
        .collection("tasks").doc(task.id).delete()
        .then(():void => {
            console.log("success");
        })
        .catch(error => {
            console.error(`Delete Task error! task id=${task.id}`,error);
        });

    }

    private static setTask(data: firestore.DocumentData) : Task {
        let task = new Task(data.date.toDate(), data.title);
        task.id = data.id;
        task.startTime =  this.toDate(data.startTime);
        task.endTime = this.toDate(data.endTime);
        task.estimateTime = data.estimateTime;
        task.isDoing = data.isDoing;
        task.repeatId = this.toString(data.repeatId);
        return task;
    }

    private static toString(value: string | undefined) : string {
        if (value === undefined) {
            //ここにひっかかるということはキー名を間違っているか、古いデータで項目がない
            console.log("toString undefined?");
            return "";
        }else{
            return value;
        }
    }

    private static toDate(date: firestore.Timestamp | undefined) : Date | null {
        if (date === undefined || date === null) {
            return null;
        }else {
            return date.toDate();
        }
    }

    static saveRepeat(uid: string, repeat: Repeat, oldRepeat: Repeat | null) : void {
        let batch: firestore.WriteBatch = firestore().batch();
        const newRef: firestore.DocumentReference = firebase.firestore()
            .collection("users").doc(uid)
            .collection("repeats").doc(repeat.id);
        batch.set(newRef, this.getRepeatLiteral(repeat));

        let oldId: string = "Non Old Repeat";
        if (oldRepeat !== null) {
            oldId = oldRepeat.id;
            const oldRef: firestore.DocumentReference = firebase.firestore()
            .collection("users").doc(uid)
            .collection("repeats").doc(oldRepeat.id);
            batch.delete(oldRef);
        } 

        batch.commit()
            .then(() => {
                console.log(`success write repeat id = ${repeat.id} delete repeat id = ${oldId}`);
            })
            .catch(error => {
                console.error(`Write repeat error! repeat id = ${repeat.id} delete repeat id = ${oldId}`,error);
            }
        );

    }

    static async loadRepeat(uid: string, repeatId: string) : Promise<Repeat> {
        const doc = await firebase
            .firestore()
            .collection("users")
            .doc(uid)
            .collection("repeats")
            .doc(repeatId)
            .get()

        let repeat: Repeat = new Repeat()
        let data: firestore.DocumentData | undefined = doc.data();
        if (data !== undefined) {
            repeat.id = this.toString(data.id);
            repeat.title = this.toString(data.title);
            const fromDate = this.toDate(data.from);
            if (fromDate !== null) {
                repeat.from = fromDate;
            }else{
                //repeatでfromがない場合はあり得ない
                throw new Error(`Repeat from undefined error repeatId=${repeatId}`);
            }
            repeat.day = data.day;

        } else {
            //存在しないrepeatIdが飛んでくるのはおかしい
            throw new Error(`load Repeat doc undefined? repeatId=${repeatId}`);
        }

        return repeat;
    }

    private static getRepeatLiteral(repeat: Repeat): Object {
        return {
            id: repeat.id,
            title: repeat.title,
            from: repeat.from,
            day: repeat.day
        };
    }
}