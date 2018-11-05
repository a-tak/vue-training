import util from "./util";
import firebase from "firebase"
import ITask from "./ITask";

export default class firebaseUtil {
    static saveTasks(uid: string, date: Date, tasks: ITask[]) : void {
        // 一旦時間は0:00でセット。セクションを取り入れるときはここの時間をセクションの時間に変更する
        const d = new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0,0);
        
        firebase.firestore().collection("users").doc(uid)
        .collection("date").doc(util.getDateString(d)).set({ tasks: tasks });
    }
}