import util from "./Util";
import firebase from "firebase"
import TaskController from '../lib/TaskController';

export default class FirebaseUtil {
    static saveTasks(uid: string, date: Date, taskctrl: TaskController) : void {
        // 一旦時間は0:00でセット。セクションを取り入れるときはここの時間をセクションの時間に変更する
        const d = new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0,0);

        firebase.firestore().collection("users").doc(uid)
        .collection("date").doc(util.getDateString(d)).set({ tasks: taskctrl.createFirestoreLiteral() });
    }

    /**
     * Firestoreからデータを読み込み結果を返す
     * @param uid 
     * @param date 
     */
    static loadTasks(uid: string, date: Date) : TaskController {
        console.log("loadTasks 1");
        let tc = new TaskController();

        firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .collection("date")
        .doc(util.getDateString(date))
        .get()
        .then(doc => {
            if (doc.exists) {
                console.log("loadTasks 2");

                const firedoc: firebase.firestore.DocumentData | undefined  = doc.data();
                if (firedoc !== undefined && firedoc.tasks != undefined) {
                    tc.loadFirestoreLiteral(firedoc.tasks);
                } else {
                    console.log("doc undefined?");
                }
            } else {
                console.log("no such document");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
        console.log("loadTasks 3");

        return tc;
    } 
}