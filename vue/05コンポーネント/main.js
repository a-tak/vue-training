Vue.component('comp-child', {
    template: '<li>{{ name }} HP. {{ hp }}</li>',
    props: ['name', 'hp']
})
var app = new Vue({
    el: '#app',
    data : {
        list: [
            { id: 1, name: 'すらりん', hp: 100 },
            { id: 2, name: 'ごぶらん', hp: 200 },
            { id: 3, name: 'どらがん', hp: 500 }
        ]
    }
})