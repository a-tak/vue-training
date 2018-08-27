new Vue({
    el: '#app',
    data: {
        list:[]
    },
    created: function() {
        axios.get('list.json').then(function(response) {
            this.list = response.data
        }.bind(this)).catch(function(e) {
            console.error(e)
        })
    }
})