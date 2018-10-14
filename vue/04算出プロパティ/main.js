var app = new Vue({
    el: '#app',
    data: {
        width : 80
    },
    computed: {
        halfWidth: function() {
            return this.width /2
        }
    }
})