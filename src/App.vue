<template>
  <div id="app">
    <nav-bar></nav-bar>
    <main>
      <router-view/>
    </main>
  </div>
</template>

<script>
import navBar from "@/components/navBar";
export default {
  name: "app",
  components: {
    navBar
  }
};
</script>

<style>
#app {
}
main{
  padding:20px;
  
}
</style>
