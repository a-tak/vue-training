import uuid from 'uuid';

export default class Repeat {

    constructor() {
        this.id_ =  uuid();
        this.title_ = "";
        this.from_ = new Date();
        this.day_ = [];
    }

    private id_ : string;
    public get id() :  string {
        return this.id_;
    }
    public set id(value : string) {
        this.id_ = value;
    }

    private title_ : string;
    public get title() :  string {
        return this.title_;
    }
    public set title(value : string) {
        this.title_ = value;
    }

    /** リピートの開始日 */
    private from_ : Date;
    public get from() :  Date {
        return this.from_;
    }
    public set from(value : Date) {
        this.from_ = value;
    }

    /** 繰り返し曜日 */
    private day_ : string[];
    public get day() :  string[] {
        return this.day_;
    }
    public set day(value : string[]) {
        this.day_ = value;
    }

    /**
     * このリピートオブジェクトから新しいリピートオブジェクトをコピーして作成する
     * idは新しい番号を採番する
     */
    copyNew(): Repeat {
        // New時に新しい番号は自動採番
        let newRepeat = new Repeat();
        newRepeat.title = this.title_;
        newRepeat.day = this.day_;
        newRepeat.from = this.from_;
        return newRepeat;
    }
    
}