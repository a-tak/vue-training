var myComponent = {
    template: '<p>MyComponent</p>'
}
var app = new Vue({
    el: '#app',
    components: {
        'my-component': myComponent
    }
})