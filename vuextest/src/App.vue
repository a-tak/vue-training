<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// 補完機能に任せて書いたが、ここだとこういう書き方になるのがよくわからん。スコープだろうけど。
// https://012-jp.vuejs.org/guide/components.html
export default Vue.extend({
  created() : void {
    //ストアから値取得
    console.log(this.$store.state.count);
    //ストアの値アップ ミューテーションで定義された操作でしか値を操作できない
    this.$store.commit('increment');
    //ステートに直接アクセスするよりgetterに統一した方がいいらしい
    console.log('getter count = ' + this.$store.getters.count);
    //値を変更してやる!
    this.$store.commit('setcount',99);
    console.log('getter count = ' + this.$store.getters.count);
    //actionで複雑なことをしてやる!
    //dispatchはほんとう戻り値にpromise貰えるので終了したかを検知できる!
    this.$store.dispatch('setName', "A-tak");
    console.log('getter username = ' + this.$store.getters.username);

  }
})
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
