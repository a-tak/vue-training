export default interface ITask {
    id: string;
    date: Date;
    title: string;
    isDoing: boolean;
    startTime: Date | null;
    endTime: Date | null;
}
