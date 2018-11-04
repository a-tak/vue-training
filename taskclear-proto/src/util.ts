export default class util {
    // 現地時間のyyyy-mm-dd形式の文字列を返す
    static getDateString(d: Date): string {
        return `${d.getFullYear().toString()}-${("0" + d.getMonth().toString()).slice(-2)}-${("0" + d.getDate().toString()).slice(-2)}`;
    }
}