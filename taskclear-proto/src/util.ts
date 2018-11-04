export default class util {
    // 現地時間のyyyy-mm-dd形式の文字列を返す
    static getDateString(d: Date): string {
        return `${d.getFullYear().toString()}-${("0" + d.getMonth().toString()).slice(-2)}-${("0" + d.getDate().toString()).slice(-2)}`;
    }

    static getTimeString(d: Date): string {
        //なんでundifinedも通るし、stringの引数が渡ってくるの?
        if (d == undefined) return "";
        console.log("start getTimeString!" + typeof(d).toString());
        console.log("getTimeString = " + d.toString());
        return `${d.getHours().toString()}:${("0" + d.getMinutes().toString()).slice(-2)}`;
    }
}