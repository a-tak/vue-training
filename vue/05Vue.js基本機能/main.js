new Vue({
    el: '#app',
    data: {
        name: 'キマイラ',
        list:[
            { id:1, name: 'スライム', hp: 100},
            { id:2, name: 'ゴブリン', hp: 200},
            { id:3, name: 'ドラゴン', hp: 500}
        ]
    },
    methods: {
        doAdd: function() {
            //リスト内で一番大きいID取得
            //reduceメソッド
            //第一引数がコールバックで、それの第一引数が前の要素か処理の結果、第二引数が今の要素。他にも第三、第四もある。
            //https://qiita.com/chihiro/items/1047e40514a778c08baa
            var max = this.list.reduce(function(a, b) {
                //三項演算子
                // a > b.idは条件。trueならa、falseならb.idが返る
                // aはreduceメソッドの説明にあるように前の処理の結果。
                // イニシャル値かb.idの数値が返っているので、それがaに入ってる
                // なんか直感的ではない…慣れですか?
                return a > b.id ? a : b.id
            }, 0)
            // 新しいモンスター追加
            this.list.push({
                id: max + 1,
                name: this.name,
                hp: 500
            })
        }
    }
})