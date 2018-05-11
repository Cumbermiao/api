<template>
  <div id="app">
    <nav-bar></nav-bar>
    <main>
      <keep-alive >
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
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

main{
  padding:20px;
  background: #f0f3f6;
}
</style>
