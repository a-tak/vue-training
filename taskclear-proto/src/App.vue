<template>
  <v-app>
    <v-navigateion-drawer></v-navigateion-drawer>
    <v-toolbar><v-toolbar-title>Task Clear</v-toolbar-title></v-toolbar>
    <main>
      <v-container fluid>
        <router-view/>
      </v-container>
    </main>
    <v-footer>a-tak.com 2018</v-footer>
  </v-app>
</template>

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
