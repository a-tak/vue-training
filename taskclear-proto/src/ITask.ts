import firebase,{ firestore } from 'firebase';

export default interface ITask {
    id: string;
    date: firestore.Timestamp;
    title: string;
    isDoing: boolean;
    startTime: Date | null;
    endTime: Date | null;
}
